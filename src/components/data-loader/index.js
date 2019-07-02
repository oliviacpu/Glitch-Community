import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/loader';
import { useAPI } from '../../state/api';
import { captureException } from '../../utils/sentry';

const DataLoader = ({ children, get, renderError, renderLoader, captureException: shouldCaptureException }) => {
  console.log("data loader is rendering")
  const [{ status, value }, setState] = useState({ status: 'loading', value: null });
  console.log({ status, value })
  const api = useAPI();
  useEffect(() => {
    let isCurrent = true;
    console.log("inside useEffect")
    get(api).then(
      (data) => {
        console.log("got new data", isCurrent)
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
  }, [api, get]);
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
