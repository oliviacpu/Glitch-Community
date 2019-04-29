import React, { useState } from 'react';
import { mapValues, sumBy, memoize } from 'lodash';
import { storiesOf } from '@storybook/react';
import { users, teams, projects, collections } from '../../../stories/data';
import { provideContext } from '../../../stories/util';
import CollectionsList from './index';
import MoreCollections from './more-collections';

const mockAPI = {
}

storiesOf('Collections', module)
  .add('CollectionsList', provideContext({ api: mockAPI }, () => (
    <CollectionsList collections={Object.values(collections)} />
))).add('MoreCollections', provideCon)