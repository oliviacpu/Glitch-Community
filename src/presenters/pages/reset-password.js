import React from 'react';
import PropTypes from 'prop-types';

import { EmailTokenLoginPage } from './login';

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  return <EmailTokenLoginPage token={loginToken} />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string.isRequired,
  resetPasswordToken: PropTypes.string.isRequired,
};

export default ResetPasswordPage;
