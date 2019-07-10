import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';

import SearchResults from 'Components/search-results';
import NotFound from 'Components/errors/not-found';
import MoreIdeas from 'Components/more-ideas';
import Layout from 'Components/layout';
import { useAlgoliaSearch } from 'State/search';

const SearchPage = withRouter(({ query, activeFilter, history }) => {
  const searchResults = useAlgoliaSearch(query);
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${query}&activeFilter=${filter}`);
  };

  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? (
        <SearchResults query={query} searchResults={searchResults} activeFilter={activeFilter || 'all'} setActiveFilter={setActiveFilter} />
      ) : (
        <NotFound name="anything" />
      )}
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
