import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './grid.styl';

const Grid = ({ items, children, gap, minWidth, className, style }) => (
  <ul
    className={classnames(styles.grid, className)}
    style={{
      ...style,
      '--row-gap': gap.row || gap,
      '--column-gap': gap.column || gap,
      '--min-width': minWidth,
    }}
  >
    {items.map((item) => (
      <li key={item.id} className={styles.item}>
        {children(item)}
      </li>
    ))}
  </ul>
);

Grid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  gap: PropTypes.oneOfType([
    PropTypes.shape({ row: PropTypes.node.isRequired, column: PropTypes.node.isRequired }).isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
  minWidth: PropTypes.node,
};

Grid.defaultProps = {
  className: '',
  style: {},
  gap: '10px',
  minWidth: '350px',
};

export default Grid;
