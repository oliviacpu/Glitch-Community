/// <reference types="Cypress" />

import { itemsResponse, makeTestTeam, makeTestUser, makeTestCollection, makeTestProject } from '../support/util';

const testUser = makeTestUser({ persistentToken: Cypress.env('GLITCH_TOKEN') });

const userProject = makeTestProject({
  id: 'user-project-id',
  domain: 'hello-webpage',
  description: 'I am a friendly project on Glitch dot com',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ],
});

const suspendedProject = makeTestProject({
  id: 'suspended-project-id',
  domain: 'hello-webpage',
  description: 'I was suspended',
  suspendedReason: 'Suspended for test purposes',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ],
});

describe('Project page', () => {
  beforeEach(() => {
    cy.server();
  });

  context('when signed in', () => {
    beforeEach(() => {
      cy.route('GET', '**/v1/users/by/persistentToken?persistentToken*', {
        [testUser.persistentToken]: testUser,
      });
      cy.route('GET', `**/users/by/id?id=${testUser.id}`, {
        [testUser.id]: testUser,
      });
      cy.route('GET', '**/v1/users/by/id/collections?id*', itemsResponse([]));
      cy.route('GET', '**/v1/users/by/id/projects?id*', itemsResponse([userProject]));
      cy.route('GET', '**/v1/users/by/id/teams?id*', itemsResponse([]));

      cy.signIn();
    });

    context('on one of your projects', () => {
      it.only('can perform project actions', () => {
        cy.route('GET', '**/v1/projects/by/domain*', { [userProject.domain]: userProject });
        cy.route('GET', '**/v1/projects/by/domain/users*', itemsResponse([testUser]));

        cy.visit(`/~${userProject.domain}`);
      });

      it('shows details for suspended projects');
    });
  });
});
