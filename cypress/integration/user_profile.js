/// <reference types="Cypress" />

import util from '../support/util'

describe('User profile', () => {
  context('when signed in', () => {
    context('when on your own profile', () => {
      beforeEach(() => {
        cy.signIn()

        cy.server()
        cy.route({
          method: 'GET',
          url: 'https://api.glitch.com/v1/projects/by/id*',
        }).as('projectsById')
      })

      it('can feature projects', () => {
        cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
        cy.route('PATCH', 'https://api.glitch.com/users/3803619', { featuredProjectId: "a122f2b2-8a43-41b7-a1db-35237223a45e" })

        cy.visit('/@olivia').wait('@projectsById')

        cy.get('[data-cy=featured-project]').should('not.exist')

        cy.get('[data-cy=recent-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Feature').click()
          })
        })

        cy.get('[data-cy=featured-project]').should('exist')
      })

      it('can add pin', () => {
        cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
        cy.route('POST', 'https://api.glitch.com/users/3803619/pinned-projects/*', {
          createdAt: "2019-05-21T21:19:13.854Z",
          projectId: "a122f2b2-8a43-41b7-a1db-35237223a45e",
          updatedAt: "2019-05-21T21:19:13.854Z",
          userId: 3803619
        })

        cy.visit('/@olivia').wait('@projectsById')

        cy.get('[data-cy=pinned-projects]').should('not.exist')

        cy.get('[data-cy=recent-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Pin').should('exist').click()
          })
        })

        cy.get('[data-cy=pinned-projects]').should('exist')
      })

      it('can remove pin', () => {
        const testProject = util.makeTestProject()
        cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
        cy.route('GET', 'https://api.glitch.com/v1/users/by/login/pinnedProjects?login=olivia&limit=100&orderKey=createdAt&orderDirection=DESC', {
          "items":[
            testProject
          ],
          "limit":100,
          "orderKey":"createdAt",
          "orderDirection":"DESC",
          "lastOrderValue":"2019-04-12T23:23:28.941Z",
          "hasMore":false
        })
        cy.route({
          method: 'DELETE',
          url: 'https://api.glitch.com/users/3803619/pinned-projects/*',
          response: 'OK',
        })

        cy.signIn()
        cy.visit('/@olivia').wait('@projectsById')

        cy.get('[data-cy=pinned-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Un-Pin').should('exist').click()
          })
        })

        cy.get('[data-cy=pinned-projects]').should('not.exist')
      })

      xit('can add project to collection', () => { })
      xit('can leave project', () => { })

      it('can delete project', () => {
        cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
        cy.route({
          method: 'DELETE',
          url: 'https://api.glitch.com/projects/*',
          response: 'OK',
        }).as('deleteProject')

        cy.visit('/@olivia').wait('@projectsById')

        cy.get('[data-cy=page-numbers]').should('contain', '1 / 3')
        cy.get('[data-cy=total-projects]').should('contain', '13')

        cy.get('[data-cy=recent-projects]').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Delete Project').should('exist').click()
          })
        })

        cy.wait('@deleteProject')

        cy.get('[data-cy=page-numbers]').should('contain', '1 / 2')
        cy.get('[data-cy=total-projects]').should('contain', '12')
      })
    })
  })
})
