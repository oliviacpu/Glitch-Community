import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile-list';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './collection-result-item.styl';

const CollectionResultItem = ({ onClick, collection, active }) => (
  <div className={classnames(styles.collectionResult, active && styles.active)}>
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
      <Button size="small" href={`/@${collection.fullUrl}`} newTab>
        View →
      </Button>
    </div>
  </div>
);

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  active: PropTypes.bool,
};

CollectionResultItem.defaultProps = {
  active: false,
};

export default CollectionResultItem;
