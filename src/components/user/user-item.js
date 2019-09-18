import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import Cover from 'Components/search-result-cover-bar';
import Thanks from 'Components/thanks';
import Image from 'Components/images/image';
import { getUserAvatarUrl, ANON_AVATAR_URL } from 'Models/user';
import { UserLink } from 'Components/link';
import styles from './user-item.styl';

const ProfileAvatar = ({ user }) => <Image className={styles.avatar} src={getUserAvatarUrl(user)} backgroundColor={user.color} defaultSrc={ANON_AVATAR_URL} alt="" />;

const NameAndLogin = ({ user }) =>
  user.name ? (
    <>
      <div className={styles.itemButtonWrap}>
        <Button as="span">{user.name}</Button>
      </div>
      <div className={styles.login}>@{user.login}</div>
    </>
  ) : (
    <div className={styles.itemButtonWrap}>
      <Button as="span">@{user.login}</Button>
    </div>
  );

const UserItem = ({ user }) => (
  <UserLink className={styles.container} user={user}>
    <Cover type="user" item={user} size="medium" />
    <div className={styles.mainContent}>
      <div className={styles.avatarWrap}>
        <ProfileAvatar user={user} />
      </div>
      <div className={styles.body}>
        <div className={styles.nameLoginWrap}>
          <NameAndLogin user={user} />
        </div>
        <Markdown length={96}>{user.description || ' '}</Markdown>
        <Thanks count={user.thanksCount} />
      </div>
    </div>
  </UserLink>
);

UserItem.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number.isRequired,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserItem;
