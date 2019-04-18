import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import Loader from 'Components/loaders/loader';
// import CollectionItem from 'Components/collection/collection-item';

import { useTrackedFunc } from './segment-analytics';
import CollectionItem from './collection-item';
import { getLink, createCollection } from '../models/collection';
import { useNotifications } from './notifications';

import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';


function CollectionsList({ collections: rawCollections, title, isAuthorized, maybeTeam }) {
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

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article className="collections">
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <CreateCollectionButton maybeTeam={maybeTeam} />
          {!hasCollections && <CreateFirstCollection />}
        </>
      )}
      <CollectionsUL collections={collections} isAuthorized={isAuthorized} deleteCollection={deleteCollection} />
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

CollectionsList.defaultProps = {
  maybeTeam: undefined,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className="placeholder">Create collections to organize your favorite projects.</p>
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
    return (
      <div id="create-collection-container">
        <Loader />
      </div>
    );
  }

  return (
    <div id="create-collection-container">
      <button className="button" id="create-collection" onClick={onClick}>
        Create Collection
      </button>
    </div>
  );
}

CreateCollectionButton.propTypes = {
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
};

export const CollectionsUL = ({ collections, deleteCollection, isAuthorized }) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">

      {orderedCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          {...{
            collection,
            isAuthorized,
            deleteCollection,
          }}
        />
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionsUL.defaultProps = {
  deleteCollection: () => {},
};

export default CollectionsList;
