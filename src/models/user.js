/* globals CDN_URL */
const cacheBuster = Math.floor(Math.random() * 1000);

export const ANON_AVATAR_URL = 'https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399';

export function getDisplayName({ login, name }) {
  if (name) {
    return name;
  }
  if (login) {
    return `@${login}`;
  }
  return 'Anonymous User';
}

export function getLink({ id, login }) {
  if (login) {
    return `/@${login}`;
  }
  return `/user/${id}`;
}

export function getAvatarUrl({ login, avatarUrl }) {
  if (login && avatarUrl) {
    return avatarUrl;
  }
  return ANON_AVATAR_URL;
}

export function getAvatarThumbnailUrl({ login, avatarThumbnailUrl }) {
  if (login && avatarThumbnailUrl) {
    return avatarThumbnailUrl;
  }
  return ANON_AVATAR_URL;
}

export function getAvatarStyle({ avatarUrl, color }) {
  return {
    backgroundColor: color,
    backgroundImage: `url('${avatarUrl || ANON_AVATAR_URL}')`,
  };
}

export function getCoverUrl({ id, hasCoverImage, cache = cacheBuster, size = 'large' }) {
  const customImage = `${CDN_URL}/user-cover/${id}/${size}?${cache}`;
  const defaultImage = 'https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fuser-cover.svg';
  return hasCoverImage ? customImage : defaultImage;
}

export function getProfileStyle(params) {
  // five random light colors from randomcolor 
  const lightColors = ['rgb(247, 173, 191)', 'rgb(192, 249, 134)', 'rgb(215, 170, 247)', 'rgb(252, 252, 159)', 'rgb(183, 228, 247)'];
  return {
    backgroundColor: lightColors[params.id % 5],
    backgroundImage: `url('${getCoverUrl(params)}')`,
  };
}
