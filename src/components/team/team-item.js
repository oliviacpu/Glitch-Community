import PropTypes from 'prop-types';
import React from 'react';
import { sumBy } from 'lodash';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import Cover from 'Components/blocks/search-result-cover-bar';
import Image from 'Components/images/image';
import Thanks from 'Components/blocks/thanks';
import UsersList from 'Components/user/users-list';
import { getAvatarUrl, DEFAULT_TEAM_AVATAR } from 'Models/team';
import { TeamLink } from '../../presenters/includes/link';
import { VerifiedBadge } from '../../presenters/includes/team-elements';

import styles from './team-item.styl';

const ProfileAvatar = ({ team }) => <Image className={styles.avatar} src={getAvatarUrl(team)} defaultSrc={DEFAULT_TEAM_AVATAR} alt="" />;

const getTeamThanksCount = (team) => sumBy(team.users, (user) => user.thanksCount);

const TeamItem = ({ team }) => (
  <TeamLink className={styles.container} team={team}>
    <Cover type="team" item={team} size="medium" />
    <div className={styles.mainContent}>
      <div className={styles.avatarWrap}>
        <ProfileAvatar team={team} />
      </div>
      <div className={styles.body}>
        <div>
          <Button decorative>{team.name}</Button>
          {!!team.isVerified && <VerifiedBadge />}
        </div>
        <div className={styles.usersList}>
          <UsersList avatarsOnly users={team.users} layout="block" />
        </div>
        <Markdown length={96}>{team.description || ' '}</Markdown>
        <Thanks count={getTeamThanksCount(team)} />
      </div>
    </div>
  </TeamLink>
);

TeamItem.propTypes = {
  team: PropTypes.shape({
    description: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamItem;
