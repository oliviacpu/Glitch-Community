import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Loader } from '@fogcreek/shared-components';

import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import SmallCollectionItem from 'Components/collection/collection-item-small';
import Heading from 'Components/text/heading';
import Row from 'Components/containers/row';
import { UserLink, TeamLink } from 'Components/link';
import { getDisplayName } from 'Models/user';
import { getSingleItem } from 'Shared/api';
import { useCollectionContext, useCollectionCurator } from 'State/collection';
import useSample from 'Hooks/use-sample';

import styles from './styles.styl';

const loadMoreCollectionsFromAuthor = ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorEndpoint = `${authorType}s`;
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  // get up to 10 collections from the author
  return getSingleItem(api, `v1/${authorEndpoint}/${authorId}/collections?limit=10&orderKey=createdAt&orderDirection=DESC`, 'items');
};

function useCollectionsWithProjects(collections) {
  const getCollectionProjects = useCollectionContext();
  const responses = collections.map(getCollectionProjects);
  const allResponsesComplete = responses.every((r) => r.status !== 'loading');
  if (!allResponsesComplete) return null;

  const moreCollectionsWithProjects = [];
  responses.forEach((response, i) => {
    if (response.status === 'ready' && response.value.length > 0) {
      moreCollectionsWithProjects.push({ ...collections[i], projects: response.value });
    }
  });

  return moreCollectionsWithProjects.filter((c) => !c.isMyStuff);
}

const MoreCollections = ({ currentCollection, collections }) => {
  const curator = useCollectionCurator(currentCollection);
  const allCollectionsWithProjects = useCollectionsWithProjects(collections);
  const sampleCollectionsWithProjects = useSample(allCollectionsWithProjects || [], 3);
  if (!allCollectionsWithProjects) return <Loader style={{ width: '25px' }} />;
  if (!allCollectionsWithProjects.length) return null;

  const isUserCollection = currentCollection.teamId === -1;
  const type = isUserCollection ? 'user' : 'team';
  return (
    <>
      <div className={styles.moreByLinkWrap}>
        <Heading tagName="h2">
          {curator.status === 'ready' ? (
            <>
              {curator.value.user && (
                <UserLink user={curator.value.user}>
                  More by {getDisplayName(curator.value.user)} <Icon className={styles.arrow} icon="arrowRight" />
                </UserLink>
              )}
              {curator.value.team && (
                <TeamLink team={curator.value.team}>
                  More from {curator.value.team.name} <Icon className={styles.arrow} icon="arrowRight" />
                </TeamLink>
              )}
            </>
          ) : (
            <>More collections</>
          )}
        </Heading>
      </div>
      <CoverContainer type={type} item={currentCollection[type]}>
        <Row items={sampleCollectionsWithProjects}>{(collection) => <SmallCollectionItem key={collection.id} collection={collection} />}</Row>
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
