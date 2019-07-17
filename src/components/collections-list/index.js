import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem, { MyStuffItem } from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { useCollectionProjects } from 'State/collection';

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
  name: 'My Stuff',
  description: 'My place to save cool finds',
  coverColor: '#ffccf9', 
  projects: [],
  id: 'My Stuff',
};

function CollectionsListWithDevToggle(props) {
  const myStuffEnabled = useDevToggle('My Stuff');
  return myStuffEnabled ? <CollectionsListWithMyStuff {...props} /> : <CollectionsList {...props} />;
}

function MyStuffCollectionLoader({ collections, myStuffCollection, ...props }) {
  const { value: projects } = useCollectionProjects(myStuffCollection);

  if (projects.length > 0 || props.isAuthorized) {
    myStuffCollection.projects = projects;
    collections.unshift(myStuffCollection);
  }
  return <CollectionsList collections={collections} {...props} />;
}

function CollectionsListWithMyStuff({ collections, ...props }) {
  const myStuffCollection = collections.find((collection) => collection.isBookmarkCollection);
  if (myStuffCollection) {
    return <MyStuffCollectionLoader myStuffCollection={myStuffCollection} collections={collections} {...props} />;
  }

  if (!props.isAuthorized) {
    return <CollectionsList collections={collections} {...props} />;
  }

  if (props.isAuthorized) {
    collections.unshift(nullMyStuffCollection);
    return <CollectionsList collections={collections} {...props} />;
  }
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

  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

  const myStuffEnabled = useDevToggle('My Stuff');

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
        {(collection) =>
          myStuffEnabled && collection.isBookmarkCollection ? (
            <MyStuffItem collection={collection} />
          ) : (
            <CollectionItem
              collection={collection}
              isAuthorized={isAuthorized}
              deleteCollection={() => deleteCollection(collection)}
              showCurator={showCurator}
            />
          )
        }
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

export default CollectionsListWithDevToggle;
