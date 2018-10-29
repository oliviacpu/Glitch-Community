import React from 'react';
import PropTypes from 'prop-types';
/* global Raven */

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }
  
  componentDidCatch(error) {
    console.error(error);
    Raven.captureException(error);
    this.setState({error});
  }
  
  render() {
    const {children, fallback} = this.props;
    const {error} = this.state;
    return error ? fallback : children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  fallback: 'Something went wrong, try refreshing?',
};