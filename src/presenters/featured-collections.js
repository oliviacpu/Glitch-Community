import React from 'react';
import CollectionContainer from 'Components/collection/container';
import DataLoader from 'Components/data-loader';
import { captureException } from 'Utils/sentry';
import { getSingleItem } from 'Shared/api';

import { featuredCollections } from '../curated/collections';

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
