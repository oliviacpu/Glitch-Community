import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

const nullMyStuffCollection = {
  isBookmarkCollection: true,
  name: "My Stuff",
  description: "My place to save cool finds",
  fullUrl: "sarahzinger/my-stuff",
  id: 9970,
  coverColor: "#ffccf9"
}

function CollectionsList({ collections: rawCollections, title, isAuthorized, maybeTeam, showCurator }) {
  const { deleteItem } = useAPIHandlers();
  const { currentUser } = useCurrentUser();
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(collection) {
    setDeletedCollectionIds((ids) => [...ids, collection.id]);
    return deleteItem({ collection });
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  let orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');
  console.log(1, { orderedCollections })
  let myStuffCollection = orderedCollections.filter(collection => collection.isBookmarkCollection);
  console.log(2, { orderedCollections })
  myStuffCollection = myStuffCollection.length > 0 ? myStuffCollection[0] : nullMyStuffCollection
  orderedCollections.unshift(myStuffCollection)
  /*
    Plan: 
    - add MyStuff to ordered Collections if it doesn't exist yet
    - first collection in orderedCollections should get rendered differently
    - create that component
      - not deletable
      - when empty and not authed it doesn't show up
      - when you click it you create it for real in the database?
  */
  console.log(3, {orderedCollections})

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article data-cy="collections" className={styles.collections}>
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <CreateCollectionButton team={maybeTeam} />
          {!hasCollections && <CreateFirstCollection />}
        </>
      )}
      <Grid items={orderedCollections}>
        {(collection, idx) => {
          console.log(idx)
          return <CollectionItem
            collection={collection}
            isAuthorized={isAuthorized}
            deleteCollection={() => deleteCollection(collection)}
            showCurator={showCurator}
          />
        }}
      </Grid>
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
};

CollectionsList.defaultProps = {
  maybeTeam: undefined,
  isAuthorized: false,
  showCurator: false,
};

export default CollectionsList;
