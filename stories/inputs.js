import React from 'react';
import { storiesOf } from '@storybook/react';

import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import WrappingTextInput from 'Components/inputs/wrapping-text-input';

storiesOf('Text Input', module)
  .add('text input', () => <TextInput placeholder="type something!" />)
  .add('affixes', () => <TextInput placeholder="type something!" prefix="#" postfix="#" />)
  .add('search', () => <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users" />)
  .add('with error', () => <TextInput placeholder="glitch" error="That team already exists" />)
  .add('text area', () => <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required" />)
  .add('wrapping text', () => <WrappingTextInput placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required" />);