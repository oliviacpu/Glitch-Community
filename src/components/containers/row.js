import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { range } from 'lodash';
import styles from './row.styl';

const Row = ({ items, children, count, gap, minWidth, className, style }) => (
  <ul
    className={classnames(styles.row, className)}
    style={{
      ...style,
      '--item-count': count,
      '--gap': gap,
      '--min-width': minWidth,
    }}
  >
    {items.slice(0, count).map((item) => (
      <li key={item.id} className={styles.item}>
        {children(item)}
      </li>
    ))}
    {count > items.length && range(0, count - items.length).map((i) => <li key={`filler-${i}`} className={styles.filler} />)}
  </ul>
);

Row.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  count: PropTypes.number,
  gap: PropTypes.node,
  minWidth: PropTypes.node,
};

Row.defaultProps = {
  className: '',
  style: {},
  count: 3,
  gap: undefined,
  minWidth: undefined,
};

export default Row;
