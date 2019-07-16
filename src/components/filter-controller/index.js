import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';

import styles from './styles.styl';

function FilterController({ enabled, placeholder, items, children }) {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterProjects() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredProjects(items.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => filterProjects(), [items]);
  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedProjects = filtering ? filteredProjects : items;

  return children({
    filterInput: enabled && (
      <TextInput
        data-cy="items-filter"
        className={styles.headerSearch}
        name="filter"
        onChange={setFilter}
        opaque
        placeholder="find a project"
        labelText="project search"
        type="search"
        value={filter}
      />
    ),
    renderProjects: (renderFn) => {
      if (displayedProjects.length) return renderFn(displayedProjects);

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

export default FilterController;
