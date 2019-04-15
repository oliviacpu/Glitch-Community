import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
import { useAlgoliaSearch } from '../../state/search';
import useDevToggle from '../../presenters/includes/dev-toggles';
import PopoverContainer from '../../presenters/pop-overs/popover-container';
import AutocompleteSearch from './autocomplete';
import styles from './form.styl';

// when results are loading, show the previous set of results instead.
function useLastCompleteSearchResult(query) {
  const results = useAlgoliaSearch(query);
  const [lastCompleteResults, setLastCompleteResults] = useState(results);
  useEffect(() => {
    if (results.status === 'ready') {
      setLastCompleteResults(results);
    }
  }, [results.status]);
  return lastCompleteResults;
}

function AlgoliaSearchController({}) {
  const onKeyUp = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      publish({ type: 'up' });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      publish({ type: 'down' });
    }
  };
  return children({
    query,
    autoCompleteResults: visible && <AutocompleteSearch query={query} results={results} />,
  });
}

function LegacySearchController({ children, defaultValue }) {
  const [query, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    setSubmitted(true);
  };

  return children({
    query,
    onSubmit,
    submitted,
    autoComplete: 'on',
    autoCompleteResults: null,
  });
}

function SearchController({ children, defaultValue }) {
  const algoliaFlag = useDevToggle('Algolia Search');

  if (algoliaFlag) return <AlgoliaSearchController defaultValue={defaultValue}>{children}</AlgoliaSearchController>;
}

const Form = ({ defaultValue }) => (
  <SearchController defaultValue={defaultValue}>
    {({ query, onChange, onFocus, onSubmit, onKeyUp, submitted, autoComplete, autoCompleteResults }) => (
      <form
        className={styles.container}
        action="/search"
        method="get"
        role="search"
        onSubmit={onSubmit}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        autoComplete={autoComplete}
        autoCapitalize="off"
      >
        <TextInput labelText="Search Glitch" name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={query} />
        {submitted && <Redirect to={`/search?q=${query}`} push />}
        {autoCompleteResults}
      </form>
    )}
  </SearchController>
);

Form.propTypes = {
  defaultValue: PropTypes.string,
};
Form.defaultProps = {
  defaultValue: '',
};

export default Form;
