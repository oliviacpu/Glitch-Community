import React from 'react';
import PropTypes from 'prop-types';
import { PopoverWithButton, PopoverDialog, PopoverSection } from 'Components/popover';

const TimeFrameItem = ({ selectTimeFrame, isActive, timeFrame }) => {
  let resultClass = 'result button-unstyled';
  if (isActive) {
    resultClass += ' active';
  }
  return (
    <button className={resultClass} onClick={selectTimeFrame} type="button">
      <div className="result-container">
        <div className="result-name">{timeFrame}</div>
      </div>
    </button>
  );
};

TimeFrameItem.propTypes = {
  selectTimeFrame: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  timeFrame: PropTypes.string.isRequired,
};

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];

const TeamAnalyticsTimePop = (props) => {
  const selectTimeFrame = (timeFrame) => () => {
    props.updateTimeFrame(timeFrame);
    props.togglePopover();
  };

  return (
    <PopoverDialog align="left">
      <PopoverSection>
        <ResultsList items={ime}
        <div className="results">
          {timeFrames.map((timeFrame) => (
            <TimeFrameItem
              key={timeFrame}
              selectTimeFrame={selectTimeFrame(timeFrame)}
              isActive={props.currentTimeFrame === timeFrame}
              timeFrame={timeFrame}
            />
          ))}
        </div>
      </PopoverSection>
    </dialog>
  );
};

TeamAnalyticsTimePop.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => {
  const dropdown = <div className="down-arrow" aria-label="options" />;
  return (
    <PopoverWithButton
      buttonProps={{ size: 'small', type: 'tertiary' }}
      buttonText={
        <>
          {currentTimeFrame} {dropdown}
        </>
      }
    >
      {({ togglePopover }) => (
        <TeamAnalyticsTimePop
          updateTimeFrame={updateTimeFrame}
          currentTimeFrame={currentTimeFrame}
          togglePopover={togglePopover}
        />
      )}
    </PopoverWithButton>
  );
};

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
