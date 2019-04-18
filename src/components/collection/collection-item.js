import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile/profile-list';
import Loader from 'Components/loaders/loader';
import ProjectItemSmall from 'Components/project/project-item-small';

import { isDarkColor } from '../models/collection';
import CollectionAvatar from '../../presenters/includes/collection-avatar';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const ProjectsPreview = ({ collection, isAuthorized }) => {
  const isLoading = !collection.projects;
  if (isLoading) {
    return (
      <div className="collection-link">
        <Loader />
      </div>
    );
  }
  if (collection.projects.length > 0) {
    return (
      <>
        <ul className="projects-preview">
          {collection.projects.slice(0, 3).map((project) => (
            <li key={project.id} className={`project-container ${project.private ? 'private' : ''}`}>
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
      <span role="img" aria-label="">
        ☝️
      </span>
    </Text>
  ) : (
    <Text>No projects to see in this collection just yet.</Text>
  );
  return <div className="projects-preview empty">{emptyState}</div>;  
}

ProjectsPreview.propTypes = {
  collection: PropTypes.object.isRequired,
};

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const CollectionItem = ({ collection, isAuthorized, showCurator }) => (
  <div className={styles.collection}>
    <div className={styles.curator}>
      { showCurator && <ProfileItem user={collection.user} team={collection.team} /> }
    </div>
    
    <CollectionLink collection={collection} style={collectionColorStyles(collection)}>
      <div className={styles.collectionItemContainer}>
        <div className={styles.nameArea}>
          <div className={styles.collectionAvatarContainer}>
            <CollectionAvatar color={collection.coverColor} collectionId={collection.id} />
          </div>
          <div className={styles.collectionNameWrap}>
            <Button decorative>
              <div className={styles.collectionName}>{collection.name}</div>
            </Button>
          </div>
        </div>
        <div className={styles.description} style={{color: isDarkColor(collection.coverColor) ? 'white': ''}}>
          <Markdown>{collection.description || ' '}</Markdown>
        </div>
      </div>
    </CollectionLink>
    
    <ProjectsPreview collection={collection} isAuthorized={isAuthorized} />
    
    <CollectionLink collection={collection} className={styles.footerLink}>
      {`View ${collection.projects.length >= 3 ? 'all' : ''} `}
      <Pluralize count={collection.projects.length} singular="project" />
      <span aria-hidden="true"> →</span>
    </CollectionLink>
    
  </div>
);

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    projects: PropTypes.node,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
  collectionOptions: PropTypes.object,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
};

CollectionItem.defaultProps = {
  collectionOptions: {},
  isAuthorized: false,
  showCurator: false,
}

export default CollectionItem;
