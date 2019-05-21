// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
const omitBy = require('lodash/omitBy')
const keys = require('lodash/keys')
const isObject = require('lodash/isObject')
const isArray = require('lodash/isArray')

const filterTokens = (value) => {
  if (isArray(value)) {
    value = value.map(filterTokens)
  } else if (isObject(value)) {
    keys(value).map((key) => { value[key] = filterTokens(value[key]) })
    value = omitBy(value, (_, key) => key.match('\\w+Token|password|email'))
  }
  return value
}

Cypress.Commands.add('createFixture', (name, url) => cy
  .request({ url, headers: { Authorization: Cypress.env('GLITCH_TOKEN') } })
  .then((response) => cy.writeFile(`cypress/fixtures/${name}.json`, filterTokens(response.body))));

Cypress.Commands.add('createFixtures', (fixtures) => Object.entries(fixtures).forEach((entry) => cy.createFixture(entry[0], entry[1])));

export const makeTestProject = () => {
  return {
    "id": "a122f2b2-8a43-41b7-a1db-35237223a45e",
    "inviteToken": "f372b296-be5d-40da-a364-f21292e5c384",
    "description": "The test project that does useful things",
    "domain": "test-project",
    "baseId": "929980a8-32fc-4ae7-a66f-dddb3ae4912c",
    "private": false,
    "likesCount": 0,
    "suspendedAt": null,
    "suspendedReason": "",
    "lastAccess": "2019-05-21T21:30:58.599Z",
    "avatarUpdatedAt": "2019-04-12T23:23:30.006Z",
    "numEditorVisits": 6,
    "numAppVisits": 36,
    "visitsLastBackfilledAt": "2019-05-21T19:00:01.000Z",
    "showAsGlitchTeam": false,
    "isEmbedOnly": false,
    "remixChain": [

    ],
    "notSafeForKids": false,
    "createdAt": "2019-04-12T23:23:28.941Z",
    "updatedAt": "2019-04-13T00:07:51.923Z",
    "deletedAt": null,
    "authUserIsMember": true,
    "authUserIsTeamMember": false,
    "pin": {
    },
    "permissions": [

    ],
    "features": [

    ],
    "teamIds": [

    ],
  }
}

Cypress.Commands.add('signIn', () => {
  const GLITCH_TOKEN = Cypress.env('GLITCH_TOKEN');
  const cachedUser = {
    persistentToken: GLITCH_TOKEN,
  };
  window.localStorage.setItem('cachedUser', JSON.stringify(cachedUser));
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
