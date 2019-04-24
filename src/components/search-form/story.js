import React, { useState } from 'react';
import { mapValues, sumBy, memoize } from 'lodash';
import { storiesOf } from '@storybook/react';
import { users, teams, projects, collections } from '../../../stories/data';
import { provideContext } from '../../../stories/util';

const mockSearchDB = {
  user: Object.values(users).map((user) => ({ ...user, __searchKeys: [user.name, user.login], type: 'user' })),
  team: Object.values(teams).map((team) => ({ ...team, __searchKeys: [team.name, team.url], type: 'team' })),
  project: Object.values(projects).map((project) => ({ ...project, __searchKeys: [project.domain, project.description], type: 'project' })),
  collection: Object.values(collections).map((collection) => ({
    ...collection,
    __searchKeys: [collection.name, collection.description],
    type: 'collection',
  })),
  starterKit: [],
};

const useMockSearchProvider = memoize((query) => {
  const queryRE = new RegExp(query.replace(/[^A-Za-z]/g, ''), 'i');
  const resultsByType = mapValues(mockSearchDB, (items) => items.filter((item) => item.__searchKeys.some((key) => queryRE.test(key))));
  const topResultsByType = mapValues(mockSearchDB, (items) => items.filter((item) => item.__searchKeys.some((key) => query === key)));
  const topResults = [].concat(...Object.values(topResultsByType).map((sublist) => sublist.slice(0, 1)));
  return {
    status: 'ready',
    totalHits: sumBy(Object.values(resultsByType), (items) => items.length),
    topResults,
    ...resultsByType,
  };
});

const mockAPI = {
  async get(url) {
    return { data: this.responses[url] };
  },
  responses: {
    '/v1/users/by/id/?id=271885': { 271885: users.modernserf },
  },
};

storiesOf('SearchForm', module).add(
  'results',
  provideContext({ currentUser: {}, api: mockAPI }, () => (
    <div style={{ width: 300, position: 'relative' }}>
      <BaseSearchForm defaultValue="" showAutocomplete useSearchProvider={useMockSearchProvider} />
    </div>
  )),
);
