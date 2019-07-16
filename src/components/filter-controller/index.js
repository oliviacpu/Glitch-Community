import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';

import styles from './styles.styl';

function FilterController({ matchFn, enabled, placeholder, items, children, searchPrompt }) {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterItems() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredItems(items.filter((p) => matchFn.call(p, lowercaseFilter)));
      // setFilteredItems(items.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredItems([]);
    }
  }

  useEffect(() => filterItems(), [items]);
  useEffect(() => debounce(filterItems, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedItems = filtering ? filteredItems : items;

  return children({
    filterInput: enabled && (
      <TextInput
        data-cy="items-filter"
        className={styles.headerSearch}
        name="filter"
        onChange={setFilter}
        opaque
        placeholder={searchPrompt}
        labelText="project search"
        type="search"
        value={filter}
      />
    ),
    renderItems: (renderFn) => {
      if (displayedItems.length) return renderFn(displayedItems);

      if (filtering) {
        return (
          <div className={styles.filterResultsPlaceholder}>
            <Image alt="" src="https://cdn.glitch.com/c117d5df-3b8d-4389-9e6b-eb049bcefcd6%2Fcompass-not-found.svg?1554146070630" />
            <Text>No items found</Text>
          </div>
        );
      }
      return placeholder;
    },
  });
}

FilterController.propTypes = {
  matchFn: PropTypes.func.isRequired,
}

export default FilterController;
