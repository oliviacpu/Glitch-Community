import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import CheckboxButton from './checkbox-button'
import BookmarkButton from './bookmark-button'
import Image from 'Components/images/image';
import { withState } from '../../../stories/util';

const helloAlert = () => {
  alert('hello');
};

storiesOf('Button', module)
  .add(
    `checkbox`,
    withState(false, ({ state, setState }) => (
      <>
        <CheckboxButton value={state} onChange={setState}>
          Click to toggle!
        </CheckboxButton>
        <p>
          <label>
            <input type="checkbox" checked={state} onChange={(evt) => setState(evt.target.checked)} />← linked state
          </label>
        </p>
      </>
    )),
  )
  .add('BookmarkButton', () => (
    <BookmarkButton />
  ))