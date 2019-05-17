/// <reference types="Cypress" />

context('Header Actions', () => {
  it('Signing In', () => {
    cy.server();
    cy.route('POST', 'https://api.glitch.com/email/sendLoginEmail', {});
    cy.route('POST', 'https://api.glitch.com/auth/email/*', {
      persistentToken: Cypress.env('GLITCH_TOKEN'),
    });

    cy.visit('/');

    cy.get('.what-is-glitch').should('exist');

    cy.contains('Sign in').click();
    cy.contains('Sign in with Email').click();
    cy.get('.pop-over input').type('olivia+test@glitch.com');
    cy.contains('Send Link').click();
    cy.contains('Use a sign in code').click();
    cy.get('.pop-over input').type('sign-in-code');
    cy.get('form > .button-small').click();

    cy.get('.profile').should('contain', 'Your Projects');
  });

  it('Signing Out', () => {
    cy.visit('/');

    cy.signIn();

    cy.get('.profile').should('contain', 'Your Projects');

    cy.get('[data-tooltip="User options"]').click();
    cy.contains('Sign Out').click();

    cy.get('.what-is-glitch').should('exist');
  });

  describe('Sign In Errors', () => {
    it('Facebook', () => {
      cy.server();
      cy.route({
        method: 'POST',
        url: 'https://api.glitch.com/auth/facebook/fbcode?callbackURL=https://glitch.com/login/facebook',
        status: 403,
        response: { status: 403, message: 'The provider facebook did not return any email.' },
      });

      cy.visit('/login/facebook?code=fbcode');
    });
  });
});
