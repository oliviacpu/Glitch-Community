import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './results-list.styl';

const ResultsList = ({ items, className, children }) => (
  <ul className={classnames(styles.resultsList, className)}>
    {items.map((item) => (
      <li key={item.id} className={styles.resultItem}>
        {children(item)}
      </li>
    ))}
  </ul>
);

ResultsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ResultsList;