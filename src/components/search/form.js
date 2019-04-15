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

function useSubscription () {

}

function SearchController ({ children }) {
  const algoliaFlag = useDevToggle('Algolia Search');
  
  if (!algoliaFlag) {
    return({  })
  
  }
  
}


function Form({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const [publish, subscribe] = useSubscription();
  
  
  const onKeyUp = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      publish({ type: "up" })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      publish({ type: 'down' })
    }
  }
  
  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    if (!algoliaFlag) {
      setSubmitted(true);
      return;
    }
    
    
  };

  return (
    <PopoverContainer>
      {({ visible, setVisible }) => (
        <form
          className={styles.container}
          action="/search"
          method="get"
          role="search"
          onSubmit={onSubmit}
          onKeyUp={onKeyUp}
          autoComplete={algoliaFlag ? 'off' : 'on'}
          autoCapitalize="off"
          onFocus={() => setVisible(true)}
        >
          <TextInput labelText="Search Glitch" name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
          {submitted && <Redirect to={`/search?q=${value}`} push />}
          {algoliaFlag && visible && <AutocompleteSearch query={query} results={results} />}
        </form>
      )}
    </PopoverContainer>
  );
}

Form.propTypes = {
  defaultValue: PropTypes.string,
};
Form.defaultProps = {
  defaultValue: '',
};

export default Form;
