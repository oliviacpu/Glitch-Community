import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PopoverWithButton, PopoverDialog, PopoverSection } from 'Components/popover';
import TransparentButton from 'Components/buttons/transparent-button';

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours']

const TeamAnalyticsTimePop = ({ currentTimeFrame, updateTimeFrame }) => {
  const [selected, setSelected] = useState(currentTimeFrame)
  const onKeyDown = (e, index) => {
    
  }
  return (
    <PopoverDialog align="left">
      <PopoverSection>
        {timeFrames.map((timeFrame, index) => (
          <TransparentButton 
            key={timeFrame} 
            tabIndex={timeFrame === selected ? 0 : -1}
            onKeyDown={}
          >
            {timeFrame}
          </TransparentButton>
        ))}
      </PopoverSection>
    </PopoverDialog>
  );
}

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small', type: 'tertiary' }}
    buttonText={
      <>
        {currentTimeFrame} <div className="down-arrow" aria-label="options" />
      </>
    }
  >
    {({ toggleAndCall }) => <TeamAnalyticsTimePop updateTimeFrame={toggleAndCall(updateTimeFrame)} currentTimeFrame={currentTimeFrame} />}
  </PopoverWithButton>
);

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
