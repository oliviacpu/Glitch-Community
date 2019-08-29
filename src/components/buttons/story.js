import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import BookmarkButton from './bookmark-button';
import { withState } from '../../../stories/util';

const helloAlert = () => {
  alert('hello');
};

storiesOf('Button', module)

  .add('BookmarkButton', () => (
    <BookmarkButton />
  ))