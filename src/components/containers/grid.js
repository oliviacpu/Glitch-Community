import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import classnames from 'classnames';
import styles from './grid.styl';


const GridItem = ({ children }) => (
  <li className={styles.item} tabIndex={0}>
    {children}
  </li>
);

GridItem.propTypes = {
  children: PropTypes.node.isRequired,
};

const SortableGridItem = SortableElement(GridItem);

const Grid = ({ items, children, gap, minWidth, className, style }) => (
  <ul
    className={classnames(styles.grid, className)}
    style={{
      ...style,
      '--row-gap': (gap && gap.row) || gap,
      '--column-gap': (gap && gap.column) || gap,
      '--min-width': minWidth,
    }}
  >
    {items.map((item, index) => (
      <SortableGridItem key={item.id} index={index}>
        {children(item)}
      </SortableGridItem>
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
  ]),
  minWidth: PropTypes.node,
};

Grid.defaultProps = {
  className: '',
  style: {},
  gap: undefined,
  minWidth: undefined,
};

const SortableGrid = SortableContainer(Grid);

export default (props) => <SortableGrid axis="xy" {...props} />;
