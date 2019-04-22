import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import WrappingTextInput from 'Components/inputs/wrapping-text-input';

import OptimisticTextInput from 'Components/fields/optimistic-text-input';
import ProjectDomainInput from 'Components/fields/project-domain-input';
import TeamNameInput from 'Components/fields/team-name-input';
import TeamUrlInput from 'Components/fields/team-url-input';
import UserNameInput from 'Components/fields/user-name-input';
import UserLoginInput from 'Components/fields/user-login-input';

const inputStory = storiesOf('Text Input', module);
inputStory.add('text input', () => <TextInput placeholder="type something!" />);
inputStory.add('affixes', () => <TextInput placeholder="type something!" prefix="#" postfix="#" />);
inputStory.add('search', () => <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users" />);
inputStory.add('with error', () => <TextInput placeholder="glitch" error="That team already exists" />);
inputStory.add('text area', () => <TextArea placeholder="This is a multiline text field" error="Reason is required" />);
inputStory.add('wrapping text', () => <WrappingTextInput placeholder="This is a text field that wraps instead of scrolling" error="An error could go here!" />);

const OptimisticProps = ({ children }) => {
  const [value, setValue] = React.useState('');
  const onChange = async (newValue) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (newValue === 'error') {
      throw 'error is no good!';
    }
    setValue(newValue);
  };
  return children({ onChange, value });
};

const fieldStory = storiesOf('Text Fields', module);
fieldStory.add('optimistic input', () => <OptimisticProps>{props => <OptimisticTextInput {...props} placeholder="type error for an error" />}</OptimisticProps>);
fieldStory.add('project domain', () => <OptimisticProps>{props => <ProjectDomainInput {...props} />}</OptimisticProps>);
fieldStory.add('team name', () => <OptimisticProps>{props => <TeamNameInput {...props} />}</OptimisticProps>);
fieldStory.add('team url', () => <OptimisticProps>{props => <TeamUrlInput {...props} />}</OptimisticProps>);
fieldStory.add('user name', () => <OptimisticProps>{props => <UserNameInput {...props} />}</OptimisticProps>);
fieldStory.add('user login', () => <OptimisticProps>{props => <UserLoginInput {...props} />}</OptimisticProps>);