import React from 'react';
import CollectionContainer from 'Components/collection/container';
import DataLoader from 'Components/data-loader';
import { captureException } from 'Utils/sentry';
import { getSingleItem } from 'Shared/api';

import { featuredCollections } from '../curated/collections';

const loadCollection = async (api, { owner, name }) => {
  try {
    const collection = await getSingleItem(api, `/v1/collections/by/fullUrl?fullUrl=${encodeURIComponent(owner)}/${name}`, `${owner}/${name}`);
    collection.projects = await getSingleItem(api, `/v1/collections/by/fullUrl/projects?limit=20&fullUrl=${encodeURIComponent(owner)}/${name}`, 'items');
    collection.team = await getSingleItem(api, `/v1/teams/by/id?id=${collection.team.id}`, collection.team.id);

    return collection;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    captureException(error);
  }

  return null;
};

const loadAllCollections = async (api, infos) => {
  // don't await until every request is sent so they can all run at once
  const promises = infos.map((info) => loadCollection(api, info));
  return Promise.all(promises);
};

export const FeaturedCollections = () => (
  <DataLoader get={(api) => loadAllCollections(api, featuredCollections)}>
    {(collections) => collections.filter((c) => !!c).map((collection) => <CollectionContainer preview collection={collection} key={collection.id} />)}
  </DataLoader>
);

export default FeaturedCollections;
