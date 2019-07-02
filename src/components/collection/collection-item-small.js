import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile-list';
import { CollectionAvatar } from 'Components/images/avatar';
import VisibilityContainer from 'Components/visibility-container';
import Arrow from 'Components/arrow';
import { PrivateIcon } from 'Components/private-badge';
import { isDarkColor } from 'Models/collection';
import { useCollectionCurator } from 'State/collection';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const CollectionCurator = ({ collection }) => {
  const { value: curator } = useCollectionCurator(collection);
  return <ProfileItem {...curator} />;
};

const CollectionCuratorLoader = ({ collection }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) => (wasEverVisible ? <CollectionCurator collection={collection} /> : <ProfileItem />)}
  </VisibilityContainer>
);

const CollectionLink = ({ collection, children }) => (
  <a href={`/@${collection.fullUrl}`} className={styles.smallCollectionLink}>
    {children}
  </a>
);

const CollectionItemSmall = ({ collection, showCurator }) => (
  <div className={styles.smallContainer}>
    {showCurator && (
      <div className={styles.curator}>
        <CollectionCuratorLoader collection={collection} />
      </div>
    )}
    <CollectionLink collection={collection}>
      <div
        className={classnames(styles.bubbleContainer, styles.smallNameDescriptionArea, showCurator && styles.showCurator)}
        style={collectionColorStyles(collection)}
      >
        <div className={styles.nameArea}>
          <div className={styles.collectionAvatarContainer}>
            <CollectionAvatar collection={collection} />
          </div>
          <div className={styles.collectionNameWrap}>
            <div className={styles.itemButtonWrap}>
              <Button decorative image={collection.private ? <PrivateIcon inButton isPrivate /> : null} imagePosition="left">
                <div className={styles.collectionName}>{collection.name}</div>
              </Button>
            </div>
          </div>
        </div>
        <div
          className={styles.description}
          style={{
            color: isDarkColor(collection.coverColor) ? 'white' : '',
          }}
        >
          <Markdown length={80}>{collection.description || ' '}</Markdown>
        </div>
      </div>
      <div className={styles.smallProjectCount}>
        <Pluralize count={collection.projects.length} singular="project" /> <Arrow />
      </div>
    </CollectionLink>
  </div>
);

CollectionItemSmall.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverColor: PropTypes.string.isRequired,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
  showCurator: PropTypes.bool,
};

CollectionItemSmall.defaultProps = {
  showCurator: false,
};

export default CollectionItemSmall;
