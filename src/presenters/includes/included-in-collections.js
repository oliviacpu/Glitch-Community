import React, { createRef, useState, useEffect } from 'react';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

import CollectionItem from '../collection-item';

const getIncludedCollections = async (api, projectId) => {
  // TODO: are we only getting 3 collections here?
  const collections = await getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  return await Promise.all(
    collections.map(async (collection) => {
      const { projects, user } = await allByKeys({
        // TODO: are we only getting 3 projects here?
        projects: getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
        user: collection.user && getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id),
      });
      return { ...collection, projects, user };
    }),
  );
};

const useAsync = (cb, ...args) => {
  const [result, setResult] = useState(null)
  useEffect(() => {
    cb(...args).then(setResult);
  }, args);
  return result
};

const IncludedInCollections = ({ api, projectId }) => {
  const collections = useAsync(getIncludedCollections, api, projectId);
  if (!collections) {
    return null;
  }
  console.log(collections);
  return (
    <div className="collections">
      <h2>Included in Collections</h2>
      <ul className="collections-container">
        {collections.map(collection => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            api={api}
            isAuthorized={false}
          />
        ))}
      </ul>
    </div>
  );
};

export default IncludedInCollections;
