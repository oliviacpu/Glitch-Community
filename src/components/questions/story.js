import React, { useState } from 'react';
import { mapValues, sumBy, memoize } from 'lodash';
import { storiesOf } from '@storybook/react';
import { provideContext } from '../../../stories/util';

const mockAPI = (results) => ({
  get: () => Promise.resolve(results),
});

const questions = [].map((data) => ({ details: JSON.stringify(data) }));

storiesOf('Questions', module).add('no questions', provideContext({ api: mockAPI([]) }, () => <Questions max={3} />));
