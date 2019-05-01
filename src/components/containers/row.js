import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './row.styl';

const Row = ({ items, className, children, minItems, style }) => (
  <ul {...props} className={classnames(styles.row, className)} style={{
      ...style,
    }}>
    {items.map((item) => (
      <li key={item.id} className={styles.item}>
        {children(item)}
      </li>
    ))}
    {minItems > items.length && (
      Array(minItems - items.length).fill(null).map((_, i) => (
        <li key={`filler-${i}`} className={styles.filler} />
      ))
    )}
  </ul>
);

Row.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  className: PropTypes.string,
  children: PropTypes.func.isRequired,
  minItems: PropTypes.number,
};

Row.defaultProps = {
  className: '',
  minItems: 0,
  style: {}
};

export default Row;
