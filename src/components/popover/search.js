import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'Components/loader';
import Emoji from 'Components/images/emoji';
import ResultsList, { useActiveIndex, ScrollResult } from 'Components/containers/results-list';
import { PopoverActions, PopoverInfo, PopoverSection } from './base';

const PopoverLoader = () => (
  <PopoverActions>
    <Loader />
  </PopoverActions>
);

const NothingFound = () => (
  <PopoverActions>
    <InfoDescription>
      Nothing found <Emoji name="sparkles" />
    </InfoDescription>
  </PopoverActions>
);

function PopoverSearch({
  value,
  onChange,
  results,
  status,
  onSubmit,
  renderInitial,
  renderItem,
  renderNoResults,
  renderLoader,
  labelText,
  placeholder,
}) {
  const { activeIndex, onKeyDown } = useActiveIndex(results, onSubmit);

  return (
    <>
      <PopoverInfo>
        <TextInput
          autoFocus
          labelText={labelText}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          opaque
          placeholder={placeholder}
          type="search"
        />
      </PopoverInfo>
      {value.length === 0 && renderInitial()}
      {results.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={results}>
            {(item, i) => <ScrollResult active={i === activeIndex}>{renderItem({ item, onSubmit, active: i === activeIndex })}</ScrollResult>}
          </ResultsList>
        </PopoverSection>
      )}
      {status === 'loading' && value.length > 0 && results.length === 0 && renderLoader()}
      {status === 'ready' && value.length > 0 && results.length === 0 && renderNoResults()}
    </>
  );
}

PopoverSearch.defaultProps = {
  renderInitial: () => null,
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
};

export default PopoverSearch;
