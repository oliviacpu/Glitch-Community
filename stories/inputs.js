import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import WrappingTextInput from 'Components/inputs/wrapping-text-input';

import ProjectDomainInput from 'Components/fields/project-domain-input';

const inputStory = storiesOf('Text Input', module);
inputStory.add('text input', () => <TextInput placeholder="type something!" />);
inputStory.add('affixes', () => <TextInput placeholder="type something!" prefix="#" postfix="#" />);
inputStory.add('search', () => <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users" />);
inputStory.add('with error', () => <TextInput placeholder="glitch" error="That team already exists" />);
inputStory.add('text area', () => <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required" />);
inputStory.add('wrapping text', () => <WrappingTextInput placeholder="This is a text field that wraps instead of scrolling" error="An error could go here!" />);

const fieldStory = storiesOf('Text Fields', module);
fieldStory.add('project domain', () => <ProjectDomainInput />);