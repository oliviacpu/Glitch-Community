import React from 'react';
import PropTypes from 'prop-types';

import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

const TwoFactorSignIn = ({ initialToken }) => {
  const api = useAPI();
  const { login } = useCurrentUser();
  const [code, setCode] = React.useState('');
  const [token, setToken] = React.useState(initialToken);
  const [status, setStatus] = React.useState({});
  
  const onChange = (newCode) => {
    setCode(newCode);
    setStatus({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ working: true });
    try {
      const { data } = await api.post('/user/tfa/verifyCode', { code, token });
      login(data.user);
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.status === 401) {
        setToken(error.response.data.retryToken);
        setStatus({ message: error.response.data.message });
      } else {
        setStatus({ error: true });
      }
    }
  };

  if (status.error) {
    return (
      <>
        <Notification type="error" persistent>Error</Notification>
        Something went wrong trying to sign in.
      </>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <TextInput value={code} onChange={onChange} maxLength={6} placeholder="123456" labelText="code" error={status.message} disabled={status.working} />
      <Button size="small" disabled={status.working || code.length < 6} submit>Sign in</Button>
    </form>
  );
};

TwoFactorSignIn.propTypes = {
  initialToken: PropTypes.string.isRequired,
};

export default TwoFactorSignIn;
