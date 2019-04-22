import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import CoverContainer from 'Components/containers/cover-container';

import { getSingleItem } from '../../shared/api';

import { getDisplayName } from '../models/user';

import { DataLoader } from './includes/loader';
import { UserLink, TeamLink } from './includes/link';

import CollectionItem from './collection-item';

const loadMoreCollectionsFromAuthor = async ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorEndpoint = `${authorType}s`;
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  // get up to 10 collections from the author
  let moreCollectionsFromAuthor = await getSingleItem(api, `v1/${authorEndpoint}/${authorId}/collections?limit=10&orderKey=createdAt&orderDirection=DESC`, 'items');

  // filter out the current collection
  moreCollectionsFromAuthor = moreCollectionsFromAuthor.filter((c) => c.id !== collection.id);

  // get project details for each collection
  let moreCollectionsWithProjects = await Promise.all(moreCollectionsFromAuthor.map(async (c) => {
    c.projects = await getSingleItem(api, `/v1/collections/by/id/projects?id=${c.id}`, 'items');
    return c;
  }));

  // filter out empty collections that don't have projects
  moreCollectionsWithProjects = moreCollectionsWithProjects.filter((c) => c.projects && c.projects.length > 0);

  // pick up to 3 collections to show
  moreCollectionsWithProjects = sampleSize(moreCollectionsWithProjects, 3);

  return moreCollectionsWithProjects;
};


// TODO: componentize this (Links, CollectionItem, More Collections itself?)
const MoreCollections = ({ currentCollection, collections }) => {
  const isUserCollection = currentCollection.teamId === -1;
  const type = isUserCollection ? 'user' : 'team';

  return (
    <section>
      <h2>
        {
          isUserCollection
            ? (<UserLink user={currentCollection.user}>More by {getDisplayName(currentCollection.user)} →</UserLink>)
            : (<TeamLink team={currentCollection.team}>More from {currentCollection.team.name} →</TeamLink>)
        }
      </h2>
      <CoverContainer type={type} item={currentCollection[type]}>
        <div className="collections more-collections">
          {
            collections.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                showCurator={false}
                showProjectPreview={false}
                showCollectionAvatar={false}
              />
            ))
          }
        </div>
      </CoverContainer>
    </section>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
};

const MoreCollectionsContainer = ({ api, collection }) => (
  <DataLoader get={() => loadMoreCollectionsFromAuthor({ api, collection })}>
    {
      (collections) => collections.length > 0
        ? <MoreCollections currentCollection={collection} collections={collections} />
        : null
    }
  </DataLoader>
);


MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollectionsContainer;
