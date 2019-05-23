/// <reference types="Cypress" />

import { itemsResponse, makeTestTeam, makeTestUser, makeTestCollection, makeTestProject } from '../support/util';
import times from 'lodash/times';
import reduce from 'lodash/times';

const testUserId = 1;
const testTeamId = 1;

const testUser = makeTestUser({ persistentToken: Cypress.env('GLITCH_TOKEN'), id: testUserId });

const testTeam = makeTestTeam({
  id: testTeamId,
  authUserIsTeamMember: true,
  teamPermissions: [
    {
      userId: testUserId,
      accessLevel: 20,
    },
    {
      userId: 2,
      accessLevel: 30,
    },
  ],
  teamPermission: {
    userId: testUserId,
    teamId: testTeamId,
    accessLevel: 20,
  },
});

const featuredProject = makeTestProject({
  id: 'featured-project-id',
  domain: 'hello-webpage',
  description: 'I will be featured and unfeatured, and my domain _has_ to be "hello-webpage"',
  permissions: [
    {
      userId: testUserId,
      accessLevel: 30,
    },
  ],
  users: [testUser],
});

const pinnedProject = makeTestProject({
  id: 'pinned-project-id',
  domain: 'pinned-project',
  description: 'I will be pinned and unpinned',
  permissions: [
    {
      userId: testUserId,
      accessLevel: 30,
    },
  ],
  users: [testUser],
});

const collectedProject = makeTestProject({
  id: 'collected-project-id',
  domain: 'collected-project',
  description: 'I will be added and removed from a collection',
  permissions: [
    {
      userId: testUserId,
      accessLevel: 30,
    },
  ],
  users: [testUser],
});

const groupProject = makeTestProject({
  id: 'group-project-id',
  domain: 'group-project',
  description: 'I am a group project that will be left :(',
  authUserIsMember: true,
  authUserIsTeamMember: false,
  permissions: [
    {
      userId: testUserId,
      accessLevel: 20,
    },
    {
      userId: 2,
      accessLevel: 30,
    },
  ],

  users: [testUser],
});

const teamProject = makeTestProject({
  id: 'team-project-id',
  domain: 'team-project',
  description: 'I am a team project that will be left :(',
  authUserIsMember: true,
  authUserIsTeamMember: true,
  permissions: [
    {
      userId: testUserId,
      accessLevel: 20,
    },
    {
      userId: 2,
      accessLevel: 30,
    },
  ],
  permission: {
    userId: testUserId,
    projectId: 'team-project-id',
    accessLevel: 20,
  },
  teamIds: [testTeamId],
  users: [testUser],
});

const deletedProject = makeTestProject({
  id: 'deleted-project-id',
  domain: 'deleted-project',
  description: 'I am a project that will be deleted',
  permissions: [
    {
      userId: testUserId,
      accessLevel: 30,
    },
  ],
  users: [testUser],
});

const projects = [
  featuredProject,
  pinnedProject,
  collectedProject,
  groupProject,
  teamProject,
  deletedProject,
  ...times(6, (index) =>
    makeTestProject({
      id: `test-project-${index}-id`,
      domain: `test-project-${index}`,
      permissions: [
        {
          userId: testUserId,
          accessLevel: 30,
        },
      ],
      users: [testUser],
    }),
  ),
];

const testCollection = makeTestCollection();

const shouldHaveProjectOptions = (options) => options.forEach((option) => cy.contains('.project-options-pop', option).should('exist'));

describe('User profile', () => {
  beforeEach(() => {
    cy.server();
  });

  context('when signed in on your own profile', () => {
    beforeEach(() => {
      cy.signIn();

      cy.route('GET', '**/v1/teams/by/url?url=*', {});

      cy.route('GET', '**/collections?userId=*', [testCollection]);
      cy.route('GET', '**/collections?id=*', itemsResponse([testCollection]));

      cy.route('GET', '**/projects/byIds?ids=*', [projects]);

      cy.route('GET', `**/users/by/id?id=${testUserId}`, {
        [testUserId]: testUser,
      });

      cy.route('GET', '**/v1/users/by/login?login*', {
        [testUser.login]: testUser,
      });

      cy.route('GET', '**/v1/users/by/persistentToken?persistentToken*', {
        [testUser.persistentToken]: testUser,
      });

      cy.route('GET', '**/v1/users/by/id/collections?id*', itemsResponse([testCollection]));
      cy.route('GET', '**/v1/users/by/id/projects?id*', itemsResponse(projects));
      cy.route('GET', '**/v1/users/by/id/teams?id*', itemsResponse([testTeam]));

      cy.route('GET', '**/v1/users/by/login/pinnedProjects?login*', itemsResponse());
      cy.route('GET', '**/v1/users/by/login/collections?login*', itemsResponse([testCollection]));
      cy.route('GET', '**/v1/users/by/login/projects?login*', itemsResponse(projects));
      cy.route('GET', '**/v1/users/by/login/teams?login*', itemsResponse([testTeam]));

      cy.route(
        'GET',
        '**/v1/projects/by/id*',
        reduce(projects, (response = {}, project) => {
          response[project.id] = project;
          return response;
        }),
      );
      cy.route('GET', '**/v1/projects/by/id/collections?id*', itemsResponse([]));
    });

    it('loads the user profile', () => {
      cy.visit(`/@${testUser.login}`);

      cy.get('[data-cy=featured-project]').should('not.exist');
      cy.get('[data-cy=pinned-projects]').should('not.exist');
      cy.get('[data-cy=recent-projects]').should('exist');

      cy.percySnapshot();
    });

    it('can feature a project', () => {
      cy.route('PATCH', '**/users/*', { featuredProjectId: featuredProject.id });

      cy.visit(`/@${testUser.login}`);

      cy.contains('[data-cy=recent-projects] ul li', featuredProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);

        cy.percySnapshot('project options pop');
        cy.contains('Feature').click();
      });

      cy.percySnapshot();

      cy.route('PATCH', '**/users/*', { featuredProjectId: null });

      cy.get('[data-cy=featured-project] .project-options')
        .click()
        .parent()
        .within(() => {
          shouldHaveProjectOptions(['Un-feature']);
          cy.contains('Un-feature').click();
        });
    });

    it('can pin a project', () => {
      cy.route('POST', '**/users/*/pinned-projects/*', { projectId: pinnedProject.id });

      cy.visit(`/@${testUser.login}`);

      cy.contains('[data-cy=recent-projects] ul li', pinnedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Pin').click();
      });

      cy.percySnapshot();

      cy.route('DELETE', '**/users/*/pinned-projects/*', 'OK');

      cy.contains('[data-cy=pinned-projects] ul li', pinnedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Un-Pin', 'Add to Collection', 'Delete']);
        cy.contains('Un-Pin').click();
      });
    });

    it('can collect a project', () => {
      cy.route('PATCH', `**/collections/${testCollection.id}/add/${collectedProject.id}`, 'OK');

      cy.visit(`/@${testUser.login}`);

      cy.contains('[data-cy=recent-projects] ul li', collectedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Add to Collection').click();

        cy.route('GET', '**/collections?userId=*', [
          {
            ...testCollection,
            projects: [collectedProject],
          },
        ]);

        cy.get('.add-project-to-collection-pop')
          .should('exist')
          .within(() => {
            // Need to wait on something to get the shorter syntax to work?
            cy.get('.results')
              .find('li')
              .first()
              .click();
          });

        cy.percySnapshot();
      });
    });

    xit('can leave a project', () => {
      cy.visit(`/@${testUser.login}`);

      cy.contains('[data-cy=recent-projects] ul li', groupProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Leave']);
        cy.contains('Leave').click();
      });
    });

    it('can delete a project', () => {
      cy.route('DELETE', `**/projects/${deletedProject.id}`, 'OK');
      cy.route('GET', `**/projects/${deletedProject.id}?showDeleted=true`, 'OK');
      cy.route('GET', '**/user/deleted-projects', []);

      cy.visit(`/@${testUser.login}`);

      cy.contains('[data-cy=recent-projects] ul li', deletedProject.domain).within(() => {
        cy.get('.project-options').click();
        shouldHaveProjectOptions(['Feature', 'Pin', 'Add to Collection', 'Delete']);
        cy.contains('Delete').click();
      });

      cy.route('GET', '**/user/deleted-projects', [deletedProject]);
      cy.contains('[data-cy=deleted-projects] button', 'Show').click();

      cy.percySnapshot();
    });
  });
});
