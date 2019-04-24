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

const DirectInputProps = ({ children }) => {
  const [value, setValue] = React.useState('');
  const onChange = (newValue) => {
    setValue(newValue);
  };
  return children({ onChange, value });
};

const inputStory = storiesOf('Text Input', module);
inputStory.add('text input', () => <DirectInputProps>{props => <TextInput {...props} placeholder="type something!" />}</DirectInputProps>);
inputStory.add('affixes', () => <DirectInputProps>{props => <TextInput {...props} placeholder="type something!" prefix="#" postfix="#" />}</DirectInputProps>);
inputStory.add('search', () => <DirectInputProps>{props => <TextInput {...props} type="search" opaque={true} search={true} placeholder="bots, apps, users" />}</DirectInputProps>);
inputStory.add('with error', () => <DirectInputProps>{props => <TextInput {...props} placeholder="glitch" error="That team already exists" />}</DirectInputProps>);
inputStory.add('text area', () => <DirectInputProps>{props => <TextArea {...props} placeholder="This is a multiline text field" error="Reason is required" />}</DirectInputProps>);
inputStory.add('wrapping text', () => <DirectInputProps>{props => <WrappingTextInput {...props} placeholder="This is a single line text input that wraps" error="An error could go here!" />}</DirectInputProps>);

const OptimisticProps = ({ children, name = 'value' }) => {
  const [value, setValue] = React.useState('');
  const onChange = async (newValue) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (newValue === 'error') {
      throw 'error is no good!';
    }
    setValue(newValue);
  };
  return children({ onChange, [name]: value });
};

const fieldStory = storiesOf('Text Fields', module);
fieldStory.add('optimistic input', () => <OptimisticProps>{props => <OptimisticTextInput {...props} placeholder="type error for an error" />}</OptimisticProps>);
fieldStory.add('project domain', () => <OptimisticProps>{props => <ProjectDomainInput {...props} />}</OptimisticProps>);
fieldStory.add('team name', () => <OptimisticProps>{props => <TeamNameInput {...props} />}</OptimisticProps>);
fieldStory.add('team url', () => <OptimisticProps>{props => <TeamUrlInput {...props} />}</OptimisticProps>);
fieldStory.add('user name', () => <OptimisticProps>{props => <UserNameInput {...props} />}</OptimisticProps>);
fieldStory.add('user login', () => <OptimisticProps>{props => <UserLoginInput {...props} />}</OptimisticProps>);