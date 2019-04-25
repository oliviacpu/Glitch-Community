import React from 'react';
import { storiesOf } from '@storybook/react';
import { users, projects } from '../../../stories/data';
import { provideContext } from '../../../stories/util';
import Header from './index';

storiesOf('Header', module)
  .add('logged out', provideContext({ currentUser: { projects: [] } }, () => <Header />))
  .add('logged in', provideContext({ currentUser: { ...users.modernserf, projects: [] } }, () => <Header />))
  .add('logged in with projects', provideContext({ currentUser: { ...users.modernserf, projects: Object.values(projects) } }, () => <Header />));
