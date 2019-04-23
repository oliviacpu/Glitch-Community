import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';

import SearchResults from 'Components/search-results/search-results';
import NotFound from 'Components/errors/not-found';
import Layout from '../layout';
import MoreIdeas from '../more-ideas';

import { useAlgoliaSearch, useLegacySearch } from '../../state/search';
import useDevToggle from '../includes/dev-toggles';

// Hooks can't be _used_ conditionally, but components can be _rendered_ conditionally
const AlgoliaSearchWrapper = (props) => {
  const searchResults = useAlgoliaSearch(props.query);
  return <SearchResults {...props} searchResults={searchResults} />;
};

const LegacySearchWrapper = (props) => {
  const searchResults = useLegacySearch(props.query);
  return <SearchResults {...props} searchResults={searchResults} />;
};

const SearchPage = withRouter(({ query, activeFilter, history }) => {
  const algoliaFlag = useDevToggle('Algolia Search');
  const SearchWrapper = algoliaFlag ? AlgoliaSearchWrapper : LegacySearchWrapper;
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${query}&activeFilter=${filter}`);
  };

  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? <SearchWrapper query={query} activeFilter={activeFilter || 'all'} setActiveFilter={setActiveFilter} /> : <NotFound name="anything" />}
      <MoreIdeas />
    </Layout>
  );
});

SearchPage.propTypes = {
  query: PropTypes.string,
  activeFilter: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
  activeFilter: 'all',
};

export default SearchPage;
