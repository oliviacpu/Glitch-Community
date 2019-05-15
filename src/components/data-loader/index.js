import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/loader';

const DataLoader = ({ children, get, renderError, renderLoader }) => {
  const [{ status, value }, setState] = useState({ status: 'loading', value: null });
  useEffect(() => {
    get().then(
      (data) => {
        setState({ status: 'ready', value: data });
      },
      (error) => {
        console.error(error);
        setState({ status: 'error', value: error });
      },
    );
  }, []);
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
