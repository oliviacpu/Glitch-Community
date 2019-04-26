import React from 'react';
import { storiesOf } from '@storybook/react';
import DeletedProjects, { DeletedProjectsList } from './index';
import { projects } from '../../../stories/data';
import { withContext } from '../../../stories/util';

storiesOf('DeletedProjects', module)
  .add('items', withContext({}, () => (
  <DeletedProjectsList deletedProjects={Object.values(projects)}
)))


storiesOf('ProfileContainer', module)
  .add('user', () => (
    <ProfileContainer item={users.modernserf} type="user" teams={Object.values(teams)}>
      <p>The profile content goes here.</p>
    </ProfileContainer>
  ))
  .add('team', () => (
    <ProfileContainer item={teams['example-team']} type="team">
      <p>The profile content goes here.</p>
    </ProfileContainer>
  ))