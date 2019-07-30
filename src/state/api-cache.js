import React, { useState, useEffect, useContext, useMemo, createContext } from 'react';
import { mapValues } from 'lodash';
import { getFromApi, getSingleItem, getAllPages } from 'Shared/api';
import { useAPI } from 'State/api';
import { captureException } from 'Utils/sentry';

const CacheContext = createContext();

export const APICacheProvider = ({ children, initial }) => {
  const api = useAPI();
  const [cache, setCache] = useState(() => (
    new Map(Object.entries(initial).map(([key, value]) => [key, { status: 'loading', value, expires: -Infinity }]))
  ));
  const [cachePending, setCachePending] = useState(new Map());
  const maxAge = 60 * 1000;

  useEffect(() => {
    const expires = Date.now();
    setCache((oldCache) => new Map([...oldCache].map(([key, data]) => [key, { ...data, expires }])));
  }, [api.persistentToken]);

  useEffect(() => {
    if (cachePending.size) {
      cachePending.forEach(async (get, key) => {
        const id = Math.random();
        let result = { id, status: 'loading', expires: Infinity };
        setCache((oldCache) => new Map([...oldCache, [key, { ...result, value: oldCache.has(key) ? oldCache.get(key).value : undefined }]]));
        try {
          const value = await get(api);
          result = { status: 'ready', value, expires: Date.now() + maxAge };
        } catch (error) {
          captureException(error);
          result = { status: 'error', error, expires: Date.now() + maxAge };
        }
        setCache((oldCache) => oldCache.get(key).id === id ? new Map([...oldCache, [key, result]]) : oldCache);
      });
      setCachePending((latestCachePending) => new Map([...latestCachePending].filter(([key]) => !cachePending.has(key))));
    }
  }, [api, cachePending]);

  const getCached = (key, get) => {
    const response = cache.has(key) ? cache.get(key) : { status: 'loading', expires: -Infinity };
    if (response.expires < Date.now() && !cachePending.has(key)) {
      setCachePending((latestCachePending) => new Map([...latestCachePending, [key, get]]));
    }
    return response;
  };

  return <CacheContext.Provider value={getCached}>{children}</CacheContext.Provider>;
};

export const useCached = (url) => {
  const getCached = useContext(CacheContext);
  return getCached(url, (api) => getFromApi(api, url));
};

export const useCachedItem = (url, key) => {
  const getCached = useContext(CacheContext);
  return getCached(`item:${url}`, (api) => getSingleItem(api, url, key));
};

export const useCachedPages = (url) => {
  const getCached = useContext(CacheContext);
  return getCached(`pages:${url}`, (api) => getAllPages(api, url));
};

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
