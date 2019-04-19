import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import classNames from 'classnames';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import { ProfileItem } from 'Components/profile/profile-list';
import Loader from 'Components/loaders/loader';
import ProjectItemSmall from 'Components/project/project-item-small';

import { isDarkColor } from '../../models/collection';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
import { CollectionLink } from '../../presenters/includes/link';
import CollectionOptionsContainer from '../../presenters/pop-overs/collection-options-pop';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const ProjectsPreview = ({ collection, isAuthorized }) => {
  const isLoading = !collection.projects;
  if (isLoading) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Loader />
      </div>
    );
  }
  if (collection.projects.length > 0) {
    return (
      <>
        <ul className={styles.projectsContainer}>
          {collection.projects.slice(0, 3).map((project) => (
            <li key={project.id}>
              <ProjectItemSmall project={project} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  const emptyState = isAuthorized ? (
    <Text>
      {'This collection is empty – add some projects '}
      <Emoji name="index" />
    </Text>
  ) : (
    <Text>No projects to see in this collection just yet.</Text>
  );
  return <div className={classNames(styles.projectsContainer, styles.empty)}>{emptyState}</div>;
};

ProjectsPreview.propTypes = {
  collection: PropTypes.object.isRequired,
};

const CollectionItem = ({ collection, deleteCollection, isAuthorized, showCurator }) => (
  <div className={classNames(styles.collection, {[styles.authorized]: isAuthorized})}>
    <div className={styles.container}>
      {isAuthorized && <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection} />}

      {showCurator && <div className={styles.curator}>{showCurator && <ProfileItem user={collection.user} team={collection.team} />}</div>}

      <CollectionLink
        collection={collection}
        className={classNames(styles.linkBody, { [styles.showCurator]: showCurator })}
        style={collectionColorStyles(collection)}
      >
        <div className={styles.avatarContainer}>
          <CollectionAvatar color={collection.coverColor} collectionId={collection.id} />
        </div>
        <div className={styles.nameDescriptionContainer}>
          <Button decorative>
            <div className={styles.name}>{collection.name}</div>
          </Button>
          <div className={styles.description} style={{ color: isDarkColor(collection.coverColor) ? 'white' : '' }}>
            <Markdown length={100}>{collection.description || ' '}</Markdown>
          </div>
        </div>
      </CollectionLink>

      <ProjectsPreview collection={collection} isAuthorized={isAuthorized} />

      {collection.projects && (
        <CollectionLink collection={collection} className={styles.footerLink}>
          {`View ${collection.projects.length >= 3 ? 'all' : ''} `}
          <Pluralize count={collection.projects.length} singular="project" />
          <span aria-hidden="true"> →</span>
        </CollectionLink>
      )}
    </div>
  </div>
);

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    projects: PropTypes.array,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
  deleteCollection: PropTypes.func,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
};

CollectionItem.defaultProps = {
  deleteCollection: false,
  isAuthorized: false,
  showCurator: false,
};

export default CollectionItem;
