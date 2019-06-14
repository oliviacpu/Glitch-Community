import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import useLocalStorage from 'State/local-storage';
import Button from 'Components/buttons/button';
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
        pathname: '/reset-password',
        search: `resetPasswordToken=${resetPasswordToken}`,
      },
    });
    setReady(true);
  }, []);
  return ready ? <EmailTokenLoginPage token={loginToken} /> : null;
};

const ResetPasswordForm = ({ resetPasswordToken }) => {
  const [password, setPassword] = React.useState(null);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(password, resetPasswordToken);
  };

  return (
    <form onSubmit={onSubmit}>
      <NewPasswordInput onChange={setPassword} />
      <Button size="small" disabled={!password} submit>Set Password</Button>
    </form>
  );
};

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  if (loginToken) {
    return <ResetPasswordLogin loginToken={loginToken} resetPasswordToken={resetPasswordToken} />;
  }
  return <ResetPasswordForm resetPasswordToken={resetPasswordToken} />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string,
  resetPasswordToken: PropTypes.string.isRequired,
};

ResetPasswordPage.defaultProps = {
  loginToken: null,
};

export default ResetPasswordPage;
