import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './row.styl';

const Row = ({ items, className, children, ...props }) => (
  <ul {...props} className={classnames(styles.row, className)}>
    {items.map((item) => (
      <li key={item.id} className={styles.item}>
        {children(item)}
      </li>
    ))}
  </ul>
);

Row.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  className: PropTypes.string,
  children: PropTypes.func.isRequired,
};

Row.defaultProps = {
  className: '',
};

export default Row;