import React, { useState } from 'react';
import { mapValues, sumBy, memoize } from 'lodash';
import { storiesOf } from '@storybook/react';
import { provideContext } from '../../../stories/util';
import Questions from './index';

const mockAPI = (data) => ({
  get: () => Promise.resolve({ data }),
});

const questions = Array(20)
  .fill(null)
  .map(() => ({
    details: JSON.stringify({
      domain: 'foo-bar',
      question: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
sunt in culpa qui officia deserunt mollit anim id est laborum`,
      tags: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'],
      userAvatar: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/560e4b07-a70b-4f87-b8d4-699d738792d0-small.jpg',
      userColor: '#ccc',
      userLogin: 'lorem',
      path: '/ipsum',
      line: 0,
      character: 0,
    }),
  }));

storiesOf('Questions', module)
  .add('no questions', provideContext({ api: mockAPI([]) }, () => <Questions max={3} />))
  .add('has questions', provideContext({ api: mockAPI(questions) }, () => <Questions max={3} />))
  .add('has many questions', provideContext({ api: mockAPI(questions) }, () => <Questions max={12} />));
