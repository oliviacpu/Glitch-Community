import React from 'react';
import { storiesOf } from '@storybook/react';
import { TeamProfileContainer, UserProfileContainer } from './index';
import { users, teams } from '../../../../stories/data';

storiesOf('ProfileContainer', module)
  .add('user', () => (
    <UserProfileContainer item={users.modernserf} teams={Object.values(teams)}>
      <p>The profile content goes here.</p>
    </UserProfileContainer>
  ))
  .add('team', () => (
    <TeamProfileContainer item={teams['example-team']}>
      <p>The profile content goes here.</p>
    </TeamProfileContainer>
  ));
