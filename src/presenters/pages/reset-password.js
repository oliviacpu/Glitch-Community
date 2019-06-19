import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useLocalStorage from 'State/local-storage';

import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import Notification from 'Components/notification';
import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';

import NewPasswordInput from 'Components/new-password-input';
import { EmailTokenLoginPage } from './login';

const ResetPasswordLogin = ({ loginToken, resetPasswordToken }) => {
  const [ready, setReady] = React.useState(false);
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  React.useEffect(() => {
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: '/login/reset-password',
        search: `resetPasswordToken=${resetPasswordToken}`,
      },
    });
    setReady(true);
  }, []);
  return ready ? <EmailTokenLoginPage token={loginToken} /> : null;
};

const ResetPasswordForm = ({ resetPasswordToken }) => {
  const api = useAPI();
  const [password, setPassword] = React.useState(null);
  const [state, setState] = React.useState(null);
  const isWorking = state === 'working';

  const onSubmit = async (event) => {
    event.preventDefault();
    setState('working');
    try {
      await api.post('/user/updatePasswordWithToken', {
        token: resetPasswordToken,
        password,
      });
      setState('done');
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  if (state === 'done') {
    return <Redirect to="/" />;
  }

  if (state === 'error') {
    return <>Something went wrong :(</>;
  }

  return (
    <Overlay>
      <OverlaySection type="info">
        <OverlayTitle>Reset Password <Emoji name="key" /></OverlayTitle>
      </OverlaySection>
      <OverlaySection type="actions">
        {state === 'error' ? (
          <>
            <Notification type="error" persistent></Notification>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <NewPasswordInput disabled={isWorking} onChange={setPassword} />
            <Button size="small" disabled={!password || isWorking} submit>Set Password</Button>
          </form>
        )}
      </OverlaySection>
    </Overlay>
  );
};

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  const { currentUser } = useCurrentUser();
  if (loginToken && resetPasswordToken) {
    return <ResetPasswordLogin loginToken={loginToken} resetPasswordToken={resetPasswordToken} />;
  }
  if (resetPasswordToken && currentUser && currentUser.login) {
    return <ResetPasswordForm resetPasswordToken={resetPasswordToken} />;
  }
  // Something went wrong
  return <Redirect to="/" />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string,
  resetPasswordToken: PropTypes.string.isRequired,
};

ResetPasswordPage.defaultProps = {
  loginToken: null,
};

export default ResetPasswordPage;
