import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile/profile-list';

import { isDarkColor } from '../models/collection';
import CollectionAvatar from '../../presenters/includes/collection-avatar';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const CollectionItem = ({ collection, showCurator }) => (
  <div className={styles.collection}>
    <div className={styles.curator}>
      { showCurator && <ProfileItem user={collection.user} team={collection.team} /> }
    </div>
    
    <CollectionLink collection={collection} className={styles.bubbleContainer} style={collectionColorStyles(collection)}>
      <div className={styles.collectionContainer}>
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
    
  </div>
);

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    projects: PropTypes.node,
    userId: PropTypes.number,
    teamId: PropTypes.number,
  }).isRequired,
  collectionOptions: PropTypes.object,
  showCurator: PropTypes.bool,
};

CollectionItem.defaultProps = {
  collectionOptions: {},
  showCurator: false,
}

export default CollectionItem;
