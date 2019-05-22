import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './results-list.styl';

// TODO: ResultsList should be navigable via arrow key, handle its own active status

const ResultsList = ({ scroll, items, className, children }) => (
  <div className={classnames(scroll && styles.scrollContainer, className)}>
    <ul className={styles.resultsList}>
      {items.map((item) => (
        <li key={item.id} className={classnames(styles.resultItem)}>
          {children(item, { isActive: false })}
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
