import React from "react";
import PropTypes from "prop-types";

import Notifications from "./notifications.jsx";

function handleError(notify, error) {
  console.log('handle error');
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  if (error && error.response && error.response.data) {
    return Promise.reject(error.response.data.message);
  }
  console.error(error);
  notify();
  return Promise.reject();
}

function handleCustomError(notify, error) {
  console.log('handle custom error');
  console.error(error);
  if (error && error.response && error.response.data) {
    notify(error.response.data.message, "notifyError");
  }
  return Promise.reject(error);
}

const ErrorHandler = ({ children }) => (
  <Notifications>
    {({ createNotification, createErrorNotification }) =>
      children({
        handleError: error => handleError(createErrorNotification, error),
        handleErrorForInput: error =>
          handleErrorForInput(createErrorNotification, error),
        handleCustomError: error =>
          handleCustomError(createNotification, error)
      })
    }
  </Notifications>
);
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired
};

export default ErrorHandler;
