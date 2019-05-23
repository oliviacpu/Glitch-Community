import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile-list';
import { getLink } from 'Models/collection';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './collection-result-item.styl';

const CollectionResultItem = ({ onClick, collection, isActive }) => (
  <div className={classnames(styles.collectionResult, isActive && styles.active)}>
    <TransparentButton onClick={onClick}>
      <div className={styles.resultWrap}>
        <div className={styles.avatarWrap}>
          <CollectionAvatar color={collection.coverColor} />
        </div>
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>{collection.name}</div>
          {collection.description.length > 0 && (
            <div className={styles.resultDescription}>
              <Markdown renderAsPlaintext>{collection.description}</Markdown>
            </div>
          )}
          <div className={styles.profileListWrap}>
            <ProfileItem team={collection.team} user={collection.user} size="small" />
          </div>
        </div>
      </div>
    </TransparentButton>
    <div className={styles.linkButtonWrap}>
      <Button size="small" href={getLink(collection)} newTab>
        View →
      </Button>
    </div>
  </div>
);

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
};

CollectionResultItem.defaultProps = {
  isActive: false,
};

export default CollectionResultItem;
