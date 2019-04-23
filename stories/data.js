export const users = {
  modernserf: {
    isSupport: false,
    isInfrastructureUser: false,
    id: 271885,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/560e4b07-a70b-4f87-b8d4-699d738792d0-large.jpg',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/560e4b07-a70b-4f87-b8d4-699d738792d0-small.jpg',
    login: 'modernserf',
    name: 'Justin Falcone',
    location: 'Brooklyn, NY',
    color: '#ea6996',
    description:
      'programmer & writer\n\n[🐦](https://twitter.com/modernserf) [🐙](https://github.com/modernserf) [🏠](https://justinfalcone.com) [☄](http://pronoun.is/they/.../themselves)',
    hasCoverImage: true,
    coverColor: 'rgb(84,138,53)',
    thanksCount: 1,
    utcOffset: -240,
    featuredProjectId: '22a883dc-a45d-4257-b44c-a43b6b8cabe9',
    createdAt: '2017-03-21T00:14:37.651Z',
    updatedAt: '2019-04-03T13:34:21.147Z',
    features: [],
  },
};

export const projects = {
  'judicious-pruner': {
    id: 'judicious-pruner',
    domain: 'judicious-pruner',
    description: 'a judicious project that does pruner things',
    private: false,
    showAsGlitchTeam: false,
    users: [users.modernserf],
    teams: [],
  },
  'modernserf-zebu': {
    id: 'modernserf-zebu',
    domain: 'modernserf-zebu',
    description: 'a modernserf project that does zebu things',
    private: false,
    showAsGlitchTeam: false,
    users: [users.modernserf],
    teams: [],
  },
};

export const collections = {
  12345: {
    id: 12345,
    name: 'Cool Projects',
    description: 'A collection of cool projects',
    coverColor: '#efe',
    user: users.modernserf,
    projects: [projects['judicious-pruner']],
  },
};

export const teams = {
  12345: {
    id: 12345,
    coverColor: '#efe',
    description: 'An example team',
    hasAvatarImage: false,
    hasCoverImage: false,
    isVerified: false,
    name: 'Example Team',
    url: 'example-team',
    users: [users.modernserf],
  },
};