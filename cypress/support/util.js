export const makeTestProject = () => {
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
    permissions: [
      {
        userId: 3803619,
        accessLevel: 30
      }
    ],
    features: [],
    permission: {
      userId: 3803619,
      projectId: "test-project",
      accessLevel: 30,
      userLastAccess: "2019-04-15T15:32:18.654Z",
      createdAt: "2019-04-12T23:23:28.981Z",
      updatedAt: "2019-04-15T15:32:18.661Z"
    },
    teamIds: []
  }
}

export const makeTestCollection = () => {
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
    id: 8778,
    name: "test-collection",
    team: null,
    teamId: -1,
    updatedAt: "2019-05-21T23:50:43.185Z",
    url: "test-collection",
    user: { isSupport: false, isInfrastructureUser: false, id: 3803619, login: "olivia" },
    userId: 3803619,
  }
}

export default {
  makeTestProject,
  makeTestCollection
}