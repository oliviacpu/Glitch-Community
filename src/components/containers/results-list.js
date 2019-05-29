import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
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
        <li key={item.id} className={classnames(styles.resultItemWrap)}>
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

export const ResultItem = ({ active, className, onClick, href, children }) => (
  <div className={classnames(className, styles.resultItem, active && styles.active, href && styles.withLink)}>
    <TransparentButton className={styles.resultItemButton} onClick={onClick}>
      <div className={styles.resultWrap}>
        {children}
      </div>
    </TransparentButton>
    {href && (
      <div className={styles.linkButtonWrap}>
        <Button size="small" href={href} newTab>
          View →
        </Button>
      </div>
    )}
  </div>
);

const withClass = (Component, baseClassName) => ({ children, className, ...props }) => (
  <Component className={classnames(className, baseClassName)} {...props}>
    {children}
  </Component>
);

export const ResultInfo = withClass('div', styles.resultInfo);
export const ResultName = withClass('div', styles.resultName);
export const ResultDescription = withClass('div', styles.resultDescription);
p