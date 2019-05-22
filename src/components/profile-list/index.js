import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Avatar, UserAvatar, TeamAvatar } from 'Components/images/avatar';

import { UserLink, TeamLink } from 'Components/link';

import styles from './profile-list.styl';

const UserItem = ({ user }) => (
  <UserLink user={user}>
    <UserAvatar user={user} />
  </UserLink>
);

const TeamItem = ({ team }) => (
  <TeamLink team={team}>
    <TeamAvatar team={team} />
  </TeamLink>
);

// NOTE: ResizeObserver is not widely supported
// see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
// window 'resize' event is mostly adequate for this use case,
// but continue to use clip-path to handle edge cases
const useResizeObserver = () => {
  const ref = useRef();
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const setWidthOfRef = () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width);
      }
    };
    const debouncedSetWidth = debounce(setWidthOfRef, 100);
    setWidthOfRef();

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(debouncedSetWidth);
      observer.observe(ref.current);

      return () => {
        observer.unobserve(ref.current);
      };
    }
    window.addEventListener('resize', debouncedSetWidth);
    return () => {
      window.removeEventListener('resize', debouncedSetWidth);
    };
  }, [ref, setWidth]);
  return { ref, width };
};

const parametersForSize = {
  large: {
    avatarWidth: 32,
    userOffset: -7,
    teamOffset: 7,
  },
  small: {
        avatarWidth: 32,
    userOffset: -7,
    teamOffset: 7,
    
  }
}

const RowContainer = ({ size, users, teams }) => {
  const { ref, width } = useResizeObserver();
  const avatarWidth = 32;
  const userOffset = -7;
  const teamOffset = 7;
  const maxTeams = Math.floor(width / (avatarWidth + teamOffset));
  const remainingWidth = width - (avatarWidth + teamOffset) * teams.length - teamOffset;
  const maxUsers = Math.floor((remainingWidth + userOffset) / (avatarWidth + userOffset));

  return (
    <ul ref={ref} className={classnames(styles.container, styles.row)}>
      {teams.slice(0, maxTeams).map((team) => (
        <li key={`team-${team.id}`} className={classnames(styles.teamItem, styles[size])}>
          <TeamItem team={team} />
        </li>
      ))}
      {users.slice(0, maxUsers).map((user) => (
        <li key={`user-${user.id}`} className={classnames(styles.userItem, styles[size])}>
          <UserItem user={user} />
        </li>
      ))}
    </ul>
  );
};

const BlockContainer = ({ size, users, teams }) => (
  <>
    {teams.length > 0 && (
      <ul className={styles.container}>
        {teams.map((team) => (
          <li key={`team-${team.id}`} className={classnames(styles.teamItem, styles[size])}>
            <TeamItem team={team} />
          </li>
        ))}
      </ul>
    )}
    {users.length > 0 && (
      <ul className={styles.container}>
        {users.map((user) => (
          <li key={`user-${user.id}`} className={classnames(styles.userItem, styles[size])}>
            <UserItem user={user} />
          </li>
        ))}
      </ul>
    )}
  </>
);

const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';

const GlitchTeamList = ({ size }) => (
  <ul className={styles.container}>
    <li className={classnames(styles.teamItem, styles[size])}>
      <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" />
    </li>
  </ul>
);

const PlaceholderList = ({ size }) => (
  <ul className={styles.container}>
    <li className={classnames(styles.userItem, styles[size])}>
      <div className={styles.placeholder} />
    </li>
  </ul>
);

const maybeList = (item) => (item ? [item] : []);

export const ProfileItem = ({ user, team, glitchTeam }) => (
  <ProfileList layout="block" users={maybeList(user)} teams={maybeList(team)} glitchTeam={glitchTeam} />
);

const ProfileList = ({ size, users, teams, layout, glitchTeam }) => {
  if (glitchTeam) {
    return <GlitchTeamList size={size} />;
  }

  if (!users.length && !teams.length) {
    return <PlaceholderList size={size} />;
  }

  if (layout === 'row') {
    return <RowContainer size={size} users={users} teams={teams} />;
  }

  return <BlockContainer size={size} users={users} teams={teams} />;
};

ProfileList.propTypes = {
  layout: PropTypes.oneOf(['row', 'block']).isRequired,
  size: PropTypes.oneOf(['small', 'large']),
  users: PropTypes.array,
  teams: PropTypes.array,
  glitchTeam: PropTypes.bool,
};

ProfileList.defaultProps = {
  size: 'large',
  users: [],
  teams: [],
  glitchTeam: false,
};

export default ProfileList;
