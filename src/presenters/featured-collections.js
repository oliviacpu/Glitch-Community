import React from 'react';

import CollectionContainer from 'Components/collection/container';
import DataLoader from 'Components/data-loader';
import { getCollectionWithProjects } from 'State/collection';

import { featuredCollections } from '../curated/collections';

export const FeaturedCollections = () => (
  <DataLoader get={(api) => Promise.all(featuredCollections.map((info) => getCollectionWithProjects(api, info)))}>
    {(collections) => collections.filter((c) => !!c).map((collection) => <CollectionContainer preview collection={collection} key={collection.id} />)}
  </DataLoader>
);

export default FeaturedCollections;
