import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import useLocalStorage from 'State/local-storage';
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
};

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  return loginToken
    ? <ResetPasswordLogin loginToken={loginToken} resetPasswordToken={resetPasswordToken} />
    : <ResetPasswordForm loginToken={loginToken} resetPasswordToken={resetPasswordToken} />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string,
  resetPasswordToken: PropTypes.string.isRequired,
};

ResetPasswordPage.defaultProps = {
  loginToken: null,
};

export default ResetPasswordPage;
