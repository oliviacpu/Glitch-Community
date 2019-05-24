import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import classnames from 'classnames';
import styles from './grid.styl';

const GridContainer = ({ children, gap, minWidth, className, style }) => (
  <ul
    className={classnames(styles.grid, className)}
    style={{
      ...style,
      '--row-gap': (gap && gap.row) || gap,
      '--column-gap': (gap && gap.column) || gap,
      '--min-width': minWidth,
    }}
  >
    {children}
  </ul>
);

GridContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  gap: PropTypes.oneOfType([
    PropTypes.shape({ row: PropTypes.node.isRequired, column: PropTypes.node.isRequired }).isRequired,
    PropTypes.node.isRequired,
  ]),
  minWidth: PropTypes.node,
};

GridContainer.defaultProps = {
  className: '',
  style: {},
  gap: undefined,
  minWidth: undefined,
};

const GridItem = ({ children }) => (
  <li className={styles.item} tabIndex={0}>
    {children}
  </li>
);

GridItem.propTypes = {
  children: PropTypes.node.isRequired,
};

const SortableGridContainer = SortableContainer(GridContainer);
const SortableGridItem = SortableElement(GridItem);

const Grid = ({ items, children, sortable, ...props }) => {
  if (sortable) {
    return (
      <SortableGridContainer {...props} axis="xy">
        {items.map((item, index) => (
          <SortableGridItem key={item.id} index={index}>
            {children(item)}
          </SortableGridItem>
        ))}
      </SortableGridContainer>
    );
  }
  return (
    <GridContainer {...props}>
      {items.map((item) => <GridItem key={item.id}>{children(item)}</GridItem>)}
    </GridContainer>
  );
};

Grid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  sortable: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  gap: PropTypes.oneOfType([
    PropTypes.shape({ row: PropTypes.node.isRequired, column: PropTypes.node.isRequired }).isRequired,
    PropTypes.node.isRequired,
  ]),
  minWidth: PropTypes.node,
};

Grid.defaultProps = {
  sortable: false,
  className: '',
  style: {},
  gap: undefined,
  minWidth: undefined,
};

export default Grid;
