import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';

import Header from 'Components/header';
import Footer from 'Components/footer';

import NewStuffContainer from '../../presenters/overlays/new-stuff';
import ErrorBoundary from '../../presenters/includes/error-boundary';
import Konami from '../../presenters/includes/konami';

import styles from './styles.styl';

const Layout = ({ children, searchQuery }) => (
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
      <Konami>
        <Redirect to="/secret" push />
      </Konami>
    </ErrorBoundary>
  </div>
);
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
};

export default Layout;
