import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import ReactKonami from 'react-konami';

import Header from 'Components/header';
import Footer from 'Components/footer';

import NewStuffContainer from '../../presenters/overlays/new-stuff';
import ErrorBoundary from '../../presenters/includes/error-boundary';

import styles from './styles.styl';

const Layout = ({ children, searchQuery }) => {
  const [secretActive, setSecretActive] = useState(false);
  return (
    <div className={styles.content}>
      <Helmet title="Glitch" />
      <NewStuffContainer>
        {(showNewStuffOverlay) => (
          <div className={styles.headerWrap}>
            <Header searchQuery={searchQuery} showNewStuffOverlay={showNewStuffOverlay} />
          </div>
        )}
      </NewStuffContainer>
      <ErrorBoundary>{children}</ErrorBoundary>
      <Footer />
      <ErrorBoundary fallback={null}>
        <ReactKonami easterEgg={() => setSecretActive(true)} />
        {secretActive && <Redirect to="/secret" push />}
      </ErrorBoundary>
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
};

export default Layout;
