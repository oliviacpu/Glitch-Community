/// <reference types="Cypress" />

context('Project Page', () => {
  beforeEach(() => {
    cy.server();
  });

  describe('Projects', () => {
    it('Does shows details', () => {
      cy.visit('/~community');
    });
  });

  describe('Suspended Projects', () => {
    it.only('Does not show details for suspended projects', () => {
      cy.visit('/~a-bad-project');
    });
  });
});
