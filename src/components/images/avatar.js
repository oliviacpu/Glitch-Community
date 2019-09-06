import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Image from 'Components/images/image';
import CollectionAvatarBase from 'Components/collection/defaultAvatar';

import { hexToRgbA } from 'Utils/color';
import { CDN_URL } from 'Utils/constants';

import { DEFAULT_TEAM_AVATAR, getTeamAvatarUrl } from 'Models/team';
import { ANON_AVATAR_URL, getUserAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';

import styles from './avatar.styl';

// UserAvatar
export const Avatar = ({ name, src, color, srcFallback, type, tiny, hideTooltip, withinButton }) => {
  const className = classNames(styles.avatar, styles[type], { [styles.tiny]: tiny });
  const contents = <Image src={src} defaultSrc={srcFallback} alt={name} backgroundColor={color} className={className} />;

  if (!hideTooltip) {
    return <TooltipContainer tooltip={name} target={contents} type="action" align={['left']} fallback={withinButton} />;
  }
  return contents;
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
  tiny: PropTypes.bool,
};

Avatar.defaultProps = {
  color: null,
  srcFallback: '',
  hideTooltip: false,
  tiny: false,
};

export const TeamAvatar = ({ team, size, hideTooltip, tiny }) => (
  <Avatar name={team.name} src={getTeamAvatarUrl({ ...team, size })} srcFallback={DEFAULT_TEAM_AVATAR} type="team" hideTooltip={hideTooltip} tiny={tiny} />
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
  }).isRequired,
  hideTooltip: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};
TeamAvatar.defaultProps = {
  hideTooltip: false,
  size: 'small',
};

export const UserAvatar = ({ user, suffix = '', hideTooltip, withinButton, tiny }) => (
  <Avatar
    name={getDisplayName(user) + suffix}
    src={getUserAvatarThumbnailUrl(user)}
    color={user.color}
    srcFallback={ANON_AVATAR_URL}
    type="user"
    hideTooltip={hideTooltip}
    withinButton={withinButton}
    tiny={tiny}
  />
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  suffix: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

UserAvatar.defaultProps = {
  suffix: '',
  hideTooltip: false,
  withinButton: false,
};

export const ProjectAvatar = ({ project, hasAlt, tiny }) => (
  <Avatar name={hasAlt ? project.domain : ''} src={getProjectAvatarUrl(project)} srcFallback={FALLBACK_AVATAR_URL} type="project" hideTooltip tiny={tiny} />
);

ProjectAvatar.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }).isRequired,
  hasAlt: PropTypes.bool,
};

ProjectAvatar.defaultProps = {
  hasAlt: false,
};

export const CollectionAvatar = ({ collection, tiny }) => <CollectionAvatarBase backgroundFillColor={hexToRgbA(collection.coverColor)} tiny={tiny} />;

CollectionAvatar.propTypes = {
  collection: PropTypes.shape({
    coverColor: PropTypes.string.isRequired,
  }).isRequired,
};


export const BookmarkAvatar = ({ width }) => <Image src={`${CDN_URL}/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fmy-stuff-collection-avatar%20(1).svg?v=1564432130141`} alt="" width={width} />;
