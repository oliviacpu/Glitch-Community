/// <reference types="Cypress" />

describe('Header actions', () => {
  context('when signed out', () => {
    it('can sign in with an email code', () => {
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

    context('signing in with oauth', () => {
      context('when provider fails to return email', () => {
        it('suggests email sign in', () => {
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
  });

  context('when signed in', () => {
    it('can sign out', () => {
      cy.signIn();

      cy.visit('/');

      cy.get('.profile').should('contain', 'Your Projects');

      cy.get('[data-tooltip="User options"]').click();
      cy.contains('Sign Out').click();

      cy.get('.what-is-glitch').should('exist');
    });
  });
});
