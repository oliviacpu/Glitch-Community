import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
import { useAlgoliaSearch } from '../../state/search';
import useDevToggle from '../../presenters/includes/dev-toggles';
import PopoverContainer from '../../presenters/pop-overs/popover-container';
import AutocompleteSearch from './autocomplete';
import styles from './form.styl';

const createSlice = (handlers) => {
  const actions = mapValues(handlers, (_, type) => (payload) => ({ type, payload }))
  const reducer = (state, action) => {
    if (handlers[action.type]) return handlers[action.type](state, action)
    return state
  }
  return { actions, reducer }
}

const formatResults = (searchResults) => {

}

const getResultIdOffset = ({ results, selectedResult }) => {

}

const { actions, reducer } = createSlice({
  queryChanged: (state, { payload }) => ({
    ...state,
    query: payload,
    selectedResult: null,
  }),
  resultsChanged: (state, { payload }) => ({
    ...state,
    // use last complete results
    results: payload.status === 'ready' ? formatResults(payload.value) : state.results
  }),
  arrowUp: (state, { payload }) => ({
    ...state,
    selectedResult: getResultIdOffset(state, -1),
  }),
  arrowDown: (state, { payload }) => ({
    ...state,
    selectedResult: getResultIdOffset(state, 1),
  }),
  submitted: (state) => ({
    ...state,
    submitted: !!state.query && 
  })
})

function AlgoliaSearchController({ visible, setVisible, children, defaultValue }) {
  const initialState = {
    selectedResult: null,
    query: defaultValue,
    submitted: false,
  }
  const [{ query, results, selectedResult }, dispatch] = useReducer(reducer, initialState) 
  const algoliaResults = useAlgoliaSearch(query);
  
  useEffect(() => {
    dispatch(actions.resultsChanged(algoliaResults))
  }, [algoliaResults])
  
  
  const [submitted, setSubmitted] = useState(false);

  const onKeyUp = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      dispatch(actions.arrowUp())
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch(actions.arrowDown())
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    setSubmitted(true);
  };
  return children({
    query,
    onFocus: () => setVisible(true),
    onSubmit,
    submitted,
    autoComplete: 'off',
    autoCompleteResults: visible && <AutocompleteSearch query={query} selectedResult={selectedResult} results={results} />,
  });
}

function LegacySearchController({ children, defaultValue }) {
  const [query, onChange] = useState(defaultValue);
  const [redirect, setRedirect] = useState(null);
  const onSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    set(true);
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

  if (algoliaFlag)
    return (
      <PopoverContainer>
        {(popoverProps) => (
          <AlgoliaSearchController {...popoverProps} defaultValue={defaultValue}>
            {children}
          </AlgoliaSearchController>
        )}
      </PopoverContainer>
    );

  return <LegacySearchController defaultValue={defaultValue}>{children}</LegacySearchController>;
}

const Form = ({ defaultValue }) => (
  <SearchController defaultValue={defaultValue}>
    {({ query, onChange, onFocus, onSubmit, onKeyUp, redirect, autoComplete, autoCompleteResults }) => (
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
        {redirect && <Redirect to={`/search?q=${query}`} push />}
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
