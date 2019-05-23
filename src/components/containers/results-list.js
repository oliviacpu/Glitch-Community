import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './results-list.styl';

export const ScrollResult = ({ active, children }) => {
  const ref = useRef();
  useEffect(() => {
    if (active && ref.current.scrollIntoView) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);
  return <div ref={ref}>{children}</div>;
};

export function useActiveIndex(items, onSelect) {
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);
  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev < 0) {
          return items.length - 1;
        }
        return prev - 1;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === items.length - 1) {
          return -1;
        }
        return prev + 1;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[activeIndex]) {
        onSelect(items[activeIndex]);
      }
    }
  };
  return { activeIndex, onKeyDown };
}

const ResultsList = ({ scroll, items, className, children }) => (
  <div className={classnames(scroll && styles.scrollContainer, className)}>
    <ul className={styles.resultsList}>
      {items.map((item, i) => (
        <li key={item.id} className={classnames(styles.resultItem)}>
          {children(item, i)}
        </li>
      ))}
    </ul>
  </div>
);

ResultsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  scroll: PropTypes.bool,
};

ResultsList.defaultProps = {
  className: '',
  scroll: false,
};

export default ResultsList;
