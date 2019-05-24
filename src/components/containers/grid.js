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

const GridItem = ({ children, ...props }) => (
  <li className={styles.item} {...props}>
    {children}
  </li>
);

const SortableGridContainer = SortableContainer(GridContainer);
const SortableGridItem = SortableElement(GridItem);

const Grid = ({ items, children, sortable, onReorder, ...props }) => {
  if (sortable) {
    const onDragStart = (event) => event.preventDefault();
    const onSortEnd = ({ oldIndex, newIndex }) => onReorder(items[oldIndex], newIndex);
    return (
      <SortableGridContainer {...props} axis="xy" distance={15} onSortEnd={onSortEnd}>
        {items.map((item, index) => (
          <SortableGridItem key={item.id} index={index} tabIndex={0} onDragStart={onDragStart}>
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
  sortable: (props) => props.sortable && !props.onReorder && new Error('If a container is sortable, it needs onReorder defined'),
  onReorder: PropTypes.func,
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
  onReorder: null,
  className: '',
  style: {},
  gap: undefined,
  minWidth: undefined,
};

export default Grid;
