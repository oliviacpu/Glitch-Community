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
  const defaultImage = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';
  return hasCoverImage ? customImage : defaultImage
}

export function getProfileStyle(params) {
  return {
    backgroundColor: params.coverColor,
    backgroundImage: `url('${getCoverUrl(params)}')`,
  };
}
