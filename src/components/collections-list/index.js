import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import Loader from 'Components/loader';
import CollectionItem from 'Components/collection/collection-item';
import Button from 'Components/buttons/button';
import { getLink, createCollection } from 'Models/collection';

import { useTrackedFunc } from '../../presenters/segment-analytics';
import { useNotifications } from '../../presenters/notifications';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import styles from './styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

const collectionStates = {
  ready: () => ({ type: 'ready' }),
  loading: () => ({ type: 'loading' }),
  newCollection: (url) => ({ type: 'newCollection', value: url }),
};

function CreateCollectionButton({ maybeTeam }) {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();
  const [state, setState] = useState(collectionStates.ready());

  async function createCollectionOnClick() {
    setState(collectionStates.loading());

    const collectionResponse = await createCollection(api, null, maybeTeam ? maybeTeam.id : null, createNotification);
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      if (maybeTeam) {
        collection.team = maybeTeam;
      } else {
        collection.user = currentUser;
      }
      const newCollectionUrl = getLink(collection);
      setState(collectionStates.newCollection(newCollectionUrl));
    } else {
      // error messaging handled in createCollection
      setState(collectionStates.ready());
    }
  }
  const onClick = useTrackedFunc(createCollectionOnClick, 'Create Collection clicked');

  if (state.type === 'newCollection') {
    return <Redirect to={state.value} push />;
  }
  if (state.type === 'loading') {
    return <Loader />;
  }

  return <Button onClick={onClick}>Create Collection</Button>;
}

CreateCollectionButton.propTypes = {
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
};

function CollectionsList({ collections: rawCollections, title, isAuthorized, maybeTeam, showCurator }) {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(id) {
    setDeletedCollectionIds((ids) => [...ids, id]);
    return api.delete(`/collections/${id}`);
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article className={styles.collections}>
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <div className={styles.createCollectionButtonWrap}>
            <CreateCollectionButton maybeTeam={maybeTeam} />
          </div>
          {!hasCollections && <CreateFirstCollection />}
        </>
      )}
      <ul className={styles.collectionsContainer}>
        {collections.map((collection) => (
          <li key={collection.id}>
            <CollectionItem collection={collection} isAuthorized={isAuthorized} deleteCollection={deleteCollection} showCurator={showCurator} />
          </li>
        ))}
      </ul>
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool
};

CollectionsList.defaultProps = {
  maybeTeam: undefined,
  isAuthorized: false,
  showCurator: false,
};

export default CollectionsList;
