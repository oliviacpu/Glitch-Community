import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/loader';
import { useAPI } from '../../state/api';
import { captureException } from '../../utils/sentry';

const DataLoader = ({ children, get, renderError, renderLoader, captureException: shouldCaptureException }) => {
  const [{ status, value }, setState] = useState({ status: 'loading', value: null });
  const api = useAPI();
  useEffect(() => {
    let isCurrent = true;
    get(api).then(
      (data) => {
        if (!isCurrent) return;
        setState({ status: 'ready', value: data });
      },
      (error) => {
        console.error(error);
        if (!isCurrent) return;
        setState({ status: 'error', value: error });
        if (shouldCaptureException) {
          captureException(error);
        }
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [api]);
  if (status === 'ready') return children(value);
  if (status === 'error') return renderError(value);
  return renderLoader();
};

DataLoader.propTypes = {
  children: PropTypes.func.isRequired,
  get: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoader: PropTypes.func,
};
DataLoader.defaultProps = {
  renderError: () => 'Something went wrong, try refreshing?',
  renderLoader: () => <Loader />,
};
export default DataLoader;
