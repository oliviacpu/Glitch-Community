import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from '../tooltips/tooltip-container';
import TransparentButton from '../buttons/transparent-button';

import NewStuffPup from './new-stuff-pup';

import styles from './new-stuff-prompt.styl';

const NewStuffPrompt = ({ onClick }) => (
  <div className={styles.footer}>
    <TooltipContainer
      align={['top']}
      id="new-stuff-tooltip"
      persistent
      target={<TransparentButton onClick={onClick}><NewStuffPup /></TransparentButton>}
      tooltip="New"
      type="info"
    />
  </div>
);

NewStuffPrompt.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NewStuffPrompt;
