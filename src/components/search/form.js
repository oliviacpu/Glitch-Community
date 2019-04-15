import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { mapValues, sumBy, flatMap } from 'lodash';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
import { useAlgoliaSearch } from '../../state/search';
import useDevToggle from '../../presenters/includes/dev-toggles';
import PopoverContainer from '../../presenters/pop-overs/popover-container';
import AutocompleteSearch from './autocomplete';
import styles from './form.styl';

const createSlice = (handlers) => {
  const actions = mapValues(handlers, (_, type) => (payload) => ({ type, payload }));
  const reducer = (state, action) => {
    if (handlers[action.type]) return handlers[action.type](state, action);
    return state;
  };
  return { actions, reducer };
};

const resultGroups = [
  { id: 'top', label: 'Top Results', getItems: (results) => [...results.starterKit, ...results.topResults] },
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const MAX_RESULTS_PER_TYPE = 3;

const formatResults = (results) => {
  const notTopResult = (result) => !results.topResults.includes(result);
  const getItemsFor = (group) => {
    if (group.getItems) return group.getItems(results);
    if (!results[group.id]) return [];
    return results[group.id].filter(notTopResult).slice(0, MAX_RESULTS_PER_TYPE);
  };
  return resultGroups.map((group) => ({ ...group, items: getItemsFor(group) })).filter((group) => group.items.length > 0);
};

const countResults = (results) => sumBy(results, ({ items }) => items.length);

const resultsWithSelection = (results, selectedResult) => {
  if (selectedResult === -1) return results;
  const selectedResultItem = flatMap(results, ({ items }) => items)[selectedResult];
  return results.map((group) => ({
    ...group,
    items: group.items.map((item) => (item === selectedResultItem ? { ...item, selected: true } : item)),
  }));
};

// TODO
const getUrlFor = () => '/fart';

const redirectFor = ({ query, results, selectedResult }) => {
  if (!query) return null;
  if (!selectedResult) return `/search?q=${query}`;
  const selectedResultItem = flatMap(results, ({ items }) => items)[selectedResult];
  return getUrlFor(selectedResultItem);
};

function getOffsetSelectedResult ({ results, selectedResult }, offset) {
  const flatResults = flatMap(results, ({ items }) => items);
  if (!selectedResult) {
    if (offset > 0) {
      return flatResults[offset]
    }
    if (offset < 0) {
      return flatResults[flatResults.length + offset]
    }
  }
  const nextIndex = flatResults.indexOf(selectedResult) + offset
  return flatResults[nextIndex]
}

const { actions, reducer } = createSlice({
  queryChanged: (state, { payload }) => ({
    ...state,
    query: payload,
  }),
  resultsChanged: (state, { payload }) => ({
    ...state,
    selectedResult: -1,
    results: formatResults(payload),
  }),
  arrowUp: (state) => ({
    ...state,
    selectedResult: getOffsetSelectedResult(state, -1),
  }),
  arrowDown: (state) => ({
    ...state,
    selectedResult: getOffsetSelectedResult(state, 1),
  }),
  submitted: (state) => ({
    ...state,
    redirect: redirectFor(state),
  }),
});

function AlgoliaSearchController({ visible, setVisible, children, defaultValue }) {
  const initialState = {
    selectedResult: null,
    query: defaultValue,
    redirect: null,
    results: [],
  };
  const [{ query, results, selectedResult, redirect }, dispatch] = useReducer(reducer, initialState);
  const algoliaResults = useAlgoliaSearch(query);

  useEffect(() => {
    // use last complete results
    if (algoliaResults.status === 'ready') {
      dispatch(actions.resultsChanged(algoliaResults));
    }
  }, [algoliaResults]);

  const onKeyUp = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      dispatch(actions.arrowUp());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch(actions.arrowDown());
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(actions.submitted());
  };
  return children({
    query,
    onChange: (value) => dispatch(actions.queryChanged(value)),
    onFocus: () => setVisible(true),
    onKeyUp,
    onSubmit,
    redirect,
    autoComplete: 'off',
    autoCompleteResults: query && visible && (
      <div className={styles.popOver}>
        <AutocompleteSearch query={query} results={resultsWithSelection(results, selectedResult)} />
      </div>
    ),
  });
}

function LegacySearchController({ children, defaultValue }) {
  const [query, onChange] = useState(defaultValue);
  const [redirect, setRedirect] = useState(null);
  const onSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    setRedirect(`/search?q=${query}`);
  };

  return children({
    query,
    onChange,
    onSubmit,
    redirect,
    autoComplete: 'on',
    autoCompleteResults: null,
  });
}

function SearchController({ children, defaultValue }) {
  const algoliaFlag = useDevToggle('Algolia Search');

  if (algoliaFlag) {
    return (
      <PopoverContainer>
        {(popoverProps) => (
          <AlgoliaSearchController {...popoverProps} defaultValue={defaultValue}>
            {children}
          </AlgoliaSearchController>
        )}
      </PopoverContainer>
    );
  }
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
        onFocus={onFocus}
        autoComplete={autoComplete}
        autoCapitalize="off"
      >
        <TextInput labelText="Search Glitch" name="q" onChange={onChange} onKeyUp={onKeyUp} opaque placeholder="bots, apps, users" type="search" value={query} />
        {redirect && <Redirect to={redirect} push />}
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
