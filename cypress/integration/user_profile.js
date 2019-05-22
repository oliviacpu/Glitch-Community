/// <reference types="Cypress" />

import util from '../support/util'

let testProject
let testCollection

describe('User profile', () => {
  context('when signed in', () => {
    context('when on your own profile', () => {
      beforeEach(() => {
        cy.signIn()

        cy.server()

        testProject = util.makeTestProject()
        testCollection = util.makeTestCollection()
        
        cy.route('GET', '**/v1/projects/by/id*', {
          items: [
            testProject
          ]
        })


        cy.route('GET', '**/v1/users/by/login/projects?login*', {
          items: [
            testProject,
          ]
        })

        cy.route('GET', '**/v1/projects/by/id/collections*', {
          items: []
        })

        cy.route('GET', '**/v1/users/by/id/collections?id*', {
          items: [],
        })

        cy.route('GET', '**/v1/users/by/login/collections?login*', {
          items: [],
        })

        cy.route('GET', '**/collections?userId=*', [])
      })

      it('can feature projects', () => {
        cy.route('PATCH', '**/users/*', { featuredProjectId: testProject.id })

        cy.visit('/@olivia')

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
        cy.route('POST', '**/users/*/pinned-projects/*', { projectId: testProject.id })

        cy.visit('/@olivia')

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
        cy.route('GET', '**/v1/users/by/login/pinnedProjects*', {
          items: [
            testProject
          ]
        })
        cy.route('DELETE', '**/users/3803619/pinned-projects/*', 'OK')

        cy.visit('/@olivia')

        cy.get('[data-cy=pinned-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Un-Pin').should('exist').click()
          })
        })

        cy.get('[data-cy=pinned-projects]').should('not.exist')
      })

      it('can add project to collection', () => {
        cy.visit('/@olivia')

        cy.route('GET', '**/v1/users/by/id/collections?id*', {
          items: [
            testCollection,
          ],
        })

        cy.route('GET', '**/v1/users/by/login/collections?login*', {
          items: [
            testCollection,
          ],
        })

        cy.route('GET', '**/collections?userId=*', [testCollection])

        cy.route('PATCH', '**/collections/*/add/*', "OK")

        cy.get('[data-cy=recent-projects]').should('exist').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Add to Collection').should('exist').click()

            cy.route('GET', '**/collections?userId=*', [
              {
                ...testCollection,
                projects: [
                  testProject
                ]
              },
            ])

            cy.get('.add-project-to-collection-pop').should('exist').within(() => {
              cy.get('.results').find('li').first().click()
            })
          })
        })
      })

      xit('can leave project', () => { })

      it('can delete project', () => {
        cy.route('DELETE', '**/projects/*', 'OK').as('deleteProject')
        cy.route('GET', '**/user/deleted-projects', [testProject]).as('getDeletedProject')

        cy.visit('/@olivia')

        cy.get('[data-cy=recent-projects]').within(() => {
          cy.get('ul').find('li').first().within(() => {
            cy.get('.project-options').click()
            cy.contains('Delete Project').should('exist').click()
          })
        })

        cy.wait('@deleteProject')
      })
    })
  })
})
