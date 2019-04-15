    import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
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

function AutocompleteController ({ query }) {
  const 
  
  
  return <AutocompleteSearch query={value} />
}

function Form({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const algoliaFlag = useDevToggle('Algolia Search');

  const onChange = (query) => {
    setValue(query)
    setFocusedIndex(-1)
  }
  
  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    if (focusedIndex >= 0) {
      console
    }
    
    setSubmitted(true);
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
          autoComplete={algoliaFlag ? 'off' : 'on'}
          autoCapitalize="off"
          onFocus={() => setVisible(true)}
        >
          <TextInput labelText="Search Glitch" name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
          {submitted && <Redirect to={`/search?q=${value}`} push />}
          {algoliaFlag && visible && <AutocompleteSearch query={value} />}
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
