import React from 'react';
import PropTypes from 'prop-types';
import styles from './segmented-buttons.styl';
import Button from './button';

const SegmentedButtons = ({ value, buttons, onChange }) => (
  <div className={styles.segmentedButtons}>
    {buttons.map((button) => (
      <Button key={button.name} type="tertiary" active={button.name === value} onClick={() => onChange(button.name)}>
        {button.contents}
      </Button>
    ))}
  </div>
);

SegmentedButtons.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      /** name: the filter name, passed back to onChange */
      name: PropTypes.string.isRequired,
      contents: PropTypes.node.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SegmentedButtons;
