import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'Components/loader';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import ResultsList, { useActiveIndex, ScrollResult } from 'Components/containers/results-list';
import { PopoverActions, PopoverInfo, PopoverSection, InfoDescription } from './base';

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
  renderItem,
  renderNoResults,
  renderLoader,
  renderError,
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
      {results.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={results}>
            {(item, i) => <ScrollResult active={i === activeIndex}>{renderItem({ item, onSubmit, active: i === activeIndex })}</ScrollResult>}
          </ResultsList>
        </PopoverSection>
      )}
      {status === 'loading' && value.length > 0 && results.length === 0 && renderLoader()}
      {status === 'ready' && value.length > 0 && results.length === 0 && renderNoResults()}
      {status === 'error' && renderError()}
    </>
  );
}

PopoverSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  status: PropTypes.oneOf(['init', 'loading', 'ready', 'error']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  renderNoResults: PropTypes.func,
  renderLoader: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

PopoverSearch.defaultProps = {
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
  renderError: () => null,
  placeholder: null,
};

export default PopoverSearch;
