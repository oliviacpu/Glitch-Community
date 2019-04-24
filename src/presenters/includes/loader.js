import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/loaders/loader';

const initState = { status: 'loading', value: null  }

const DataLoader = ({ children, get, renderError, renderLoader }) => {
  const [state, setState] = useState(initState)
  useEffect(() => {
    get().then(
      (data) => {
        setState()
        this.setState({
          maybeData: data,
          loaded: true,
        });
      },
      (error) => {
        console.error(error);
        this.setState({
          maybeError: error,
        });
      })
  }, [])
}

// eslint-disable-next-line import/prefer-default-export
export class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeData: null,
      loaded: false,
      maybeError: null,
    };
  }

  componentDidMount() {
    this.props.get().then(
      (data) => {
        this.setState({
          maybeData: data,
          loaded: true,
        });
      },
      (error) => {
        console.error(error);
        this.setState({
          maybeError: error,
        });
      },
    );
  }

  render() {
    if (this.state.loaded) {
      return this.props.children(this.state.maybeData);
    }
    if (this.state.maybeError) {
      return this.props.renderError(this.state.maybeError);
    }
    return this.props.renderLoader();
  }
}
DataLoader.propTypes = {
  children: PropTypes.func.isRequired,
  get: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoader: PropTypes.func,
};
DataLoader.defaultProps = {
  renderError: () => 'Something went wrong, try refreshing?',
  renderLoader: Loader,
};
