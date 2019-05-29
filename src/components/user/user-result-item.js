import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TransparentButon from 'Components/buttons/transparent-button'
import { UserAvatar } from 'Components/images/avatar';

import styles from './user-result-item.styl'

const UserResultItem = ({ user, active, onClick }) => (
  <div className={classnames(styles.userResult, active && styles.active)}>
    <TransparentButton onClick={onClick} className="result result-user">
      <div className={styles.resultWrap}>
        <UserAvatar user={user} />
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>{getDisplayName(user)}</div>
          {!!user.name && <div className={styles.resultDescription}>@{user.login}</div>}
          <Thanks short count={user.thanksCount} />
        </div>
      </div>
    </TransparentButton>
  </div>
);

UserResultItem.propTypes = {
  result: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
