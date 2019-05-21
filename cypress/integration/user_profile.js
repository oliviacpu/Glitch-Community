/// <reference types="Cypress" />

context('User Profile', () => {
  const vagueReactSelector = (tag, classname) => `${tag}[class^='${classname}'],${tag}[class*=' ${classname}']`

  const projectListSelector = vagueReactSelector('div', 'projects-list')
  const projectGridSelector = vagueReactSelector('ul', 'projects-list__projectsGrid')

  beforeEach(() => {
    cy.server()
    cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
    cy.route('PATCH', 'https://api.glitch.com/users/3803619', { featuredProjectId: "a122f2b2-8a43-41b7-a1db-35237223a45e" })
    cy.route({
      method: 'DELETE',
      url: 'https://api.glitch.com/projects/*',
      response: 'OK',
      delay: 3000,
    }).as('deleteProject')
  })

  it('Featuring Projects', () => {
    cy.signIn()
  
    cy.visit('/@olivia')

    cy.get(projectListSelector)
      .should('contain', 'Recent Projects')
      .should('contain', '1 / 3')
      .should('contain', 'Show all')
      .should('contain', '13')

    cy.get(`${projectGridSelector} > :nth-child(1)`).within(() => {
      cy.get('.project-options').click()
      cy.contains('Feature').click()
    })

    cy.get(projectListSelector)
      .should('contain', 'Recent Projects')
      .should('contain', '1 / 2')
      .should('contain', 'Show all')
      .should('contain', '12')

    cy.get(vagueReactSelector('div', 'featured-project')).should('contain', 'Featured Project')
  })

  describe('Recent Projects', () => {
    it('Deleting Projects', () => {
      cy.signIn()

      cy.visit('/@olivia')

      cy.get(projectListSelector)
        .should('contain', 'Recent Projects')
        .should('contain', '1 / 3')
        .should('contain', 'Show all')
        .should('contain', '13')

      cy.get(`${projectGridSelector} > :nth-child(1)`).within(() => {
        cy.get('.project-options').click()
        cy.contains('Delete Project').click()
      })

      cy.get(`${projectGridSelector} > :nth-child(2)`).within(() => {
        cy.get('.project-options').click()
        cy.contains('Delete Project').click()
      })

      cy.wait('@deleteProject')
      cy.wait('@deleteProject')

      cy.get(projectListSelector)
        .should('contain', 'Recent Projects')
        .should('contain', '1 / 2')
        .should('contain', 'Show all')
        .should('contain', '11')
    })
  })
})
