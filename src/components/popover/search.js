import React from 'react';

import 

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

function SearchPopover({
  value,
  onChange,
  results,
  status,
  onSubmit,
  align,
  renderInitial,
  renderItem,
  renderNoResults,
  renderLoader,
  labelText,
  placeholder,
}) {
  const { activeIndex, onKeyDown } = useActiveIndex(results, onSubmit);


  return (
    <PopoverDialog align={align}>
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
    </PopoverDialog>
  );
}

SearchPopover.defaultProps = {
  renderInitial: () => null,
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
};