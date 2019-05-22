/// <reference types="Cypress" />

import { itemsResponse, makeTestUser, makeTestCollection, makeTestProject } from '../support/util'

const testUser = makeTestUser({ persistentToken: Cypress.env('GLITCH_TOKEN') })

const featuredProject = makeTestProject({
  id: 'featured-project-id',
  domain: 'hello-webpage',
  description: 'I will be featured and unfeatured, my domain _has_ to be "hello-webpage"',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ]
})
const pinnedProject = makeTestProject({
  id: 'pinned-project-id',
  domain: 'pinned-project',
  description: 'I will be pinned and unpinned',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ]
})
const collectedProject = makeTestProject({
  id: 'collected-project-id',
  domain: 'collected-project',
  description: 'I will be added and removed from a collection',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ]
})
const deletedProject = makeTestProject({
  id: 'deleted-project-id',
  domain: 'deleted-project',
  description: 'I am a project that will be deleted',
  permissions: [
    {
      userId: testUser.id,
      accessLevel: 30,
    },
  ]
})

const projects = [featuredProject, pinnedProject, collectedProject, deletedProject]

const testCollection = makeTestCollection()

describe('User profile', () => {
  beforeEach(() => {
    cy.server()
  })

  context('when signed in', () => {
    beforeEach(() => {
      cy.signIn()
    })

    context('when on your own profile', () => {
      beforeEach(() => {
        cy.route('GET', '**/v1/teams/by/url?url=*', {})

        cy.route('GET', '**/collections?userId=*', [testCollection])
        cy.route('GET', '**/collections?id=*', itemsResponse([testCollection]))

        cy.route('GET', '**/projects/byIds?ids=*', [projects])

        cy.route('GET', `**/users/by/id?id=${testUser.id}`, {
          [testUser.id]: testUser
        })

        cy.route('GET', '**/v1/users/by/login?login*', {
          [testUser.login]: testUser
        })

        cy.route('GET', '**/v1/users/by/persistentToken?persistentToken*', {
          [testUser.persistentToken]: testUser
        })

        cy.route('GET', '**/v1/users/by/id/collections?id*', itemsResponse([testCollection]))
        cy.route('GET', '**/v1/users/by/id/projects?id*', itemsResponse(projects))
        cy.route('GET', '**/v1/users/by/id/teams?id*', itemsResponse())

        cy.route('GET', '**/v1/users/by/login/pinnedProjects?login*', itemsResponse())
        cy.route('GET', '**/v1/users/by/login/collections?login*', itemsResponse([testCollection]))
        cy.route('GET', '**/v1/users/by/login/projects?login*', itemsResponse(projects))
        cy.route('GET', '**/v1/users/by/login/teams?login*', itemsResponse())

        cy.route('GET', '**/v1/projects/by/id*', itemsResponse(projects))
        cy.route('GET', '**/v1/projects/by/id/collections?id*', itemsResponse([]))

        cy.route('PATCH', '**/users/*', { featuredProjectId: featuredProject.id }).as('featureProject')
        cy.route('POST', '**/users/*/pinned-projects/*', { projectId: pinnedProject.id }).as('pinProject')
        cy.route('DELETE', '**/users/*/pinned-projects/*', 'OK').as('unpinProject')
        cy.route('GET', '**/user/deleted-projects', []).as('getDeletedProjects')
        cy.route('PATCH', `**/collections/${testCollection.id}/add/${collectedProject.id}`, "OK").as('collectProject')
        cy.route('GET', `**/projects/${deletedProject.id}?showDeleted=true`, 'OK')
        cy.route('DELETE', `**/projects/${deletedProject.id}`, 'OK').as('deleteProject')
      })

      it.only('can perform project actions', () => {
        cy.visit(`/@${testUser.login}`)

        cy.get('[data-cy=featured-project]').should('not.exist')
        cy.get('[data-cy=pinned-projects]').should('not.exist')

        cy.get('[data-cy=recent-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Feature').click()
            cy.wait('@featureProject')
          })

          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Pin').should('exist').click()
            cy.wait('@pinProject')
          })

          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Add to Collection').should('exist').click()

            cy.route('GET', '**/collections?userId=*', [
              {
                ...testCollection,
                projects: [
                  collectedProject
                ]
              },
            ]).as('collections')

            cy.get('.add-project-to-collection-pop').should('exist').within(() => {
              cy.get('.results').find('li').first().click()
              cy.wait('@collections')
            })
          })

          cy.get('ul').find('li').next().within(() => {
            cy.get('.project-options').click()
            cy.contains('Delete Project').should('exist').click()
            cy.wait('@deleteProject')
          })
        })

        cy.get('[data-cy=featured-project]').should('exist').within(() => {
          cy.get('.project-options').click()

          cy.route('PATCH', '**/users/*', { featuredProjectId: null }).as('unfeatureProject')

          cy.contains('Un-feature').should('exist').click()
          cy.wait('@unfeatureProject')
        })

        cy.get('[data-cy=pinned-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Un-Pin').should('exist').click()
            cy.wait('@unpinProject')
          })
        })
      })
    })
  })
})
