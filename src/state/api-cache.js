import React, { useState, useEffect, useContext, useMemo, createContext } from 'react';
import { mapValues } from 'lodash';
import { getFromApi, getSingleItem, getAllPages } from 'Shared/api';
import { useAPI } from 'State/api';
import { captureException } from 'Utils/sentry';

const CacheContext = createContext();

export const APICacheProvider = ({ children, initial }) => {
  const api = useAPI();
  const [cache, setCache] = useState(() => {
    const formatted = mapValues(initial, (value) => ({ status: 'loading', value, timestamp: -Infinity }));
    return new Map(Object.entries(formatted));
  });
  const [cachePending, setCachePending] = useState(new Map());

  // on auth change mark everything as very old, that way component rerender will kick off all new requests
  useEffect(() => {
    setCache((oldCache) => new Map([...oldCache].map(([key, data]) => [key, { ...data, timestamp: -Infinity }])));
  }, [api.persistentToken]);

  useEffect(() => {
    if (!cachePending.size) return;
    const timestamp = Date.now();
    cachePending.forEach(async (get, key) => {
      // first write the loading state into the cache, preserving the old value
      let result = { status: 'loading', timestamp };
      setCache((oldCache) => {
        const value = oldCache.has(key) ? oldCache.get(key).value : undefined;
        return new Map([...oldCache, [key, { ...result, value }]]);
      });

      // next actually try to load the value and determine the new response
      try {
        const value = await get(api);
        result = { status: 'ready', value };
      } catch (error) {
        captureException(error);
        result = { status: 'error', error };
      }

      // finally put the new response in the cache if the timestamp is still up to date
      setCache((currentCache) => {
        const currentResult = currentCache.get(key);
        if (currentResult.timestamp > timestamp) {
          return currentCache;
        }
        return new Map([...currentCache, [key, { ...currentResult, ...result }]]);
      });
    });
    setCachePending((latestCachePending) => new Map([...latestCachePending].filter(([key]) => !cachePending.has(key))));
  }, [api, cachePending]);

  // the timestamp is a minimum recency for the requested data
  // several components mounting at once will naturally debounce via effects
  // if we have stale data on hand it'll show up until the fresh data loads in
  const getCached = (key, get, timestamp) => {
    const response = cache.has(key) ? cache.get(key) : { status: 'loading', timestamp: -Infinity };
    if (response.timestamp < timestamp && !cachePending.has(key)) {
      setCachePending((latestCachePending) => new Map([...latestCachePending, [key, get]]));
    }
    return response;
  };

  return <CacheContext.Provider value={getCached}>{children}</CacheContext.Provider>;
};

const useGetCached = (key, get) => {
  const getCached = useContext(CacheContext);
  const [timestamp] = useState(() => Date.now());
  return getCached(key, get, timestamp);
};

export const useCached = (url) => useGetCached(url, (api) => getFromApi(api, url));
export const useCachedItem = (url, key) => useGetCached(`item:${url}`, (api) => getSingleItem(api, url, key));
export const useCachedPages = (url) => useGetCached(`pages:${url}`, (api) => getAllPages(api, url));

export const useCombinedCache = (responses, baseResponse) => {
  const allResponses = [baseResponse, ...Object.values(responses)];
  return useMemo(() => {
    if (!baseResponse.value) return baseResponse;
    const errorResponse = allResponses.find(({ status }) => status === 'error');
    if (errorResponse) return errorResponse;
    if (allResponses.some(({ value }) => !value)) return { status: 'loading' };
    return {
      status: allResponses.every(({ status }) => status === 'ready') ? 'ready' : 'loading',
      value: { ...baseResponse.value, ...mapValues(responses, ({ value }) => value) },
    };
  }, allResponses);
};
