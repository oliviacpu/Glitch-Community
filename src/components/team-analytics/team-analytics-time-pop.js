import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { PopoverWithButton, PopoverDialog, PopoverSection } from 'Components/popover';
import TransparentButton from 'Components/buttons/transparent-button';
import styles from './styles.styl';

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];

const TeamAnalyticsTimePop = ({ currentTimeFrame, updateTimeFrame }) => {
  const [selected, setSelected] = useState(currentTimeFrame);
  const refs = useRef({});
  useEffect(() => {
    refs.current[selected].focus();
  }, [selected]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (timeFrames.indexOf(selected) + 1) % timeFrames.length;
      setSelected(timeFrames[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = (timeFrames.indexOf(selected) + timeFrames.length - 1) % timeFrames.length;
      setSelected(timeFrames[nextIndex]);
    }
  };

  return (
    <PopoverDialog align="left">
      <PopoverSection>
        {timeFrames.map((timeFrame, index) => (
          <TransparentButton
            key={timeFrame}
            ref={(el) => { refs.current[timeFrame] = el; }}
            tabIndex={timeFrame === selected ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, index)}
            onClick={() => updateTimeFrame(timeFrame)}
            className={styles.timeFrameButton}
          >
            {timeFrame}
          </TransparentButton>
        ))}
      </PopoverSection>
    </PopoverDialog>
  );
};

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
