import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import BookmarkButton from './bookmark-button';

storiesOf('Button', module)

  .add('BookmarkButton', () => (
    <BookmarkButton />
  ));
