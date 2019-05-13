import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import SmallCollectionItem from 'Components/collection/collection-item-small';
import Heading from 'Components/text/heading';
import Row from 'Components/containers/row';
import { UserLink, TeamLink } from 'Components/link';
import { getDisplayName } from 'Models/user';

import { getSingleItem } from '../../../shared/api';
import styles from './styles.styl';

const loadMoreCollectionsFromAuthor = async ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorEndpoint = `${authorType}s`;
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  // get up to 10 collections from the author
  let moreCollectionsFromAuthor = await getSingleItem(
    api,
    `v1/${authorEndpoint}/${authorId}/collections?limit=10&orderKey=createdAt&orderDirection=DESC`,
    'items',
  );

  // filter out the current collection
  moreCollectionsFromAuthor = moreCollectionsFromAuthor.filter((c) => c.id !== collection.id);

  // get project details for each collection
  let moreCollectionsWithProjects = await Promise.all(
    moreCollectionsFromAuthor.map(async (c) => {
      c.projects = await getSingleItem(api, `/v1/collections/by/id/projects?id=${c.id}`, 'items');
      return c;
    }),
  );

  // filter out empty collections that don't have projects
  moreCollectionsWithProjects = moreCollectionsWithProjects.filter((c) => c.projects && c.projects.length > 0);

  // pick up to 3 collections to show
  moreCollectionsWithProjects = sampleSize(moreCollectionsWithProjects, 3);

  return moreCollectionsWithProjects;
};

const MoreCollections = ({ currentCollection, collections }) => {
  const isUserCollection = currentCollection.teamId === -1;
  const type = isUserCollection ? 'user' : 'team';

  return (
    <>
      <div className={styles.moreByLinkWrap}>
        <Heading tagName="h2">
          {isUserCollection ? (
            <UserLink user={currentCollection.user}>More by {getDisplayName(currentCollection.user)} →</UserLink>
          ) : (
            <TeamLink team={currentCollection.team}>More from {currentCollection.team.name} →</TeamLink>
          )}
        </Heading>
      </div>
      <CoverContainer type={type} item={currentCollection[type]}>
        <Row items={collections}>{(collection) => <SmallCollectionItem key={collection.id} collection={collection} />}</Row>
      </CoverContainer>
    </>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
};

const MoreCollectionsContainer = ({ collection }) => (
  <DataLoader get={(api) => loadMoreCollectionsFromAuthor({ api, collection })}>
    {(collections) => (collections.length > 0 ? <MoreCollections currentCollection={collection} collections={collections} /> : null)}
  </DataLoader>
);
MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
};

export default MoreCollectionsContainer;
