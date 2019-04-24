import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import TextInput from 'Components/inputs/text-input';
import TextArea from 'Components/inputs/text-area';
import WrappingTextInput from 'Components/inputs/wrapping-text-input';
import MarkdownInput from 'Components/inputs/markdown-input';

import OptimisticTextInput from 'Components/fields/optimistic-text-input';
import ProjectDomainInput from 'Components/fields/project-domain-input';
import TeamNameInput from 'Components/fields/team-name-input';
import TeamUrlInput from 'Components/fields/team-url-input';
import UserNameInput from 'Components/fields/user-name-input';
import UserLoginInput from 'Components/fields/user-login-input';

const inputStory = storiesOf('Input Fields', module);

const useDirectInputProps = (error) => {
  const [value, setValue] = React.useState('');
  const onChange = (newValue) => {
    setValue(newValue);
  };
  return { error, onChange, value };
};

const GenericTextInputs = () => {
  const [showError, setShowError] = React.useState(false);
  const error = showError ? "Nope, that won't do" : null;
  const singleLineProps = useDirectInputProps(error);
  const multiLineProps = useDirectInputProps(error);
  return (
    <div style={{ maxWidth: '400px' }}>
      <p><TextInput {...singleLineProps} placeholder="A generic text input" /></p>
      <p><TextInput {...singleLineProps} prefix="#" postfix="#" placeholder="A generic input with a prefix and postfix" /></p>
      <p><TextInput {...singleLineProps} type="search" opaque={true} search={true} placeholder="Generic input styled like a search box" /></p>
      <p><WrappingTextInput {...singleLineProps} placeholder="This is a single line text input that wraps" /></p>
      <p><TextArea {...multiLineProps} placeholder="This is a multiline text area" /></p>
      <p><MarkdownInput {...multiLineProps} placeholder="This text area renders as markdown when it isn't focused" /></p>
      <p><label><input type="checkbox" checked={showError} onChange={(evt) => setShowError(evt.target.checked)} /> show an error</label></p>
    </div>
  );
};

inputStory.add('generic', () => <GenericTextInputs />);

const useOptimisticProps = (name) => {
  const [value, setValue] = React.useState('');
  const onChange = async (newValue) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (newValue === 'error') {
      throw 'error is no good!';
    }
    setValue(newValue);
  };
  return { onChange, [name]: value };
};

const ProperTextInputs = () => {
  return (
    <div style={{ maxWidth: '400px' }}>
    </div>
  );
};

inputStory.add('proper', () => <ProperTextInputs />);

const fieldStory = storiesOf('Text Fields', module);
fieldStory.add('optimistic input', () => <OptimisticProps>{props => <OptimisticTextInput {...props} placeholder="type error for an error" />}</OptimisticProps>);
fieldStory.add('project domain', () => <OptimisticProps name="domain">{props => <ProjectDomainInput {...props} />}</OptimisticProps>);
fieldStory.add('team name', () => <OptimisticProps name="name">{props => <TeamNameInput {...props} />}</OptimisticProps>);
fieldStory.add('team url', () => <OptimisticProps name="url">{props => <TeamUrlInput {...props} />}</OptimisticProps>);
fieldStory.add('user name', () => <OptimisticProps name="name">{props => <UserNameInput {...props} />}</OptimisticProps>);
fieldStory.add('user login', () => <OptimisticProps name="login">{props => <UserLoginInput {...props} />}</OptimisticProps>);