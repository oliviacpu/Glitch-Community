export const makeTestProject = (options) => {
  return {
    id: "test-project",
    description: "The test project that does useless things",
    domain: "test-project",
    baseId: "base-test-id",
    private: false,
    likesCount: 0,
    suspendedAt: null,
    suspendedReason: "",
    lastAccess: "2019-05-17T20:21:03.134Z",
    avatarUpdatedAt: "2019-04-12T23:23:30.006Z",
    numEditorVisits: 0,
    numAppVisits: 0,
    visitsLastBackfilledAt: "2019-05-17T18:00:01.000Z",
    showAsGlitchTeam: false,
    isEmbedOnly: false,
    remixChain: [],
    notSafeForKids: false,
    createdAt: "2019-04-12T23:23:28.941Z",
    updatedAt: "2019-04-13T00:07:51.923Z",
    deletedAt: null,
    authUserIsMember: true,
    authUserIsTeamMember: false,
    permissions: [],
    features: [],
    teamIds: [],
    ...options
  }
}

export const makeTestCollection = (options) => {
  return {
    authUserIsTeamMember: false,
    avatarThumbnailUrl: null,
    avatarUrl: "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633",
    coverColor: "#80c7e5",
    createdAt: "2019-05-21T23:40:36.449Z",
    deletedAt: null,
    description: "A collection of projects that does intentional things",
    featuredProjectId: null,
    fullUrl: "test-user-1/test-collection",
    id: 1,
    name: "test-collection",
    team: null,
    teamId: -1,
    updatedAt: "2019-05-21T23:50:43.185Z",
    url: "test-collection",
    projects: [],
    ...options
  }
}

export const makeTestUser = (options) => {
  return {
    avatarThumbnailUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/249bdc0c-61f2-4465-b001-e44ce3267b2e-small.jpg",
    avatarUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/249bdc0c-61f2-4465-b001-e44ce3267b2e-large.jpg",
    color: "#aacef7",
    coverColor: "rgb(244,73,68)",
    createdAt: "2019-04-09T19:50:14.645Z",
    description: "test-user",
    featuredProjectId: null,
    features: [],
    hasCoverImage: true,
    id: 1,
    isInfrastructureUser: false,
    isSupport: false,
    lastActiveDay: "2019-05-22",
    location: null,
    login: "test-user",
    name: "test-user",
    thanksCount: 0,
    updatedAt: "2019-05-22T10:03:04.046Z",
    utcOffset: -420,
    ...options,
  }
}

export const itemsResponse = (items = []) => {
  return {
    items: [...items],
  }
}
export default {
  makeTestProject,
  makeTestCollection,
  makeTestUser,
  itemsResponse
}