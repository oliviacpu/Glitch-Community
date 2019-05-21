import { useNotifications } from './notifications';

function handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  if (!(error && error.response && error.response.data)) {
    console.error(error);
    notify();
  }
  return Promise.reject(error);
}

function handleCustomError(notify, error) {
  console.error(error);
  if (error && error.response && error.response.data) {
    notify(error.response.data.message, 'notifyError');
  }
  return Promise.reject(error);
}

const useErrorHandlers = () => {
  const { createNotification, createErrorNotification } = useNotifications();
  return {
    handleError: (error) => handleError(createErrorNotification, error),
    handleErrorForInput: (error) => handleErrorForInput(createErrorNotification, error),
    handleCustomError: (error) => handleCustomError(createNotification, error),
  };
};

export default useErrorHandlers;
