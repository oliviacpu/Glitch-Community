import React from 'react';
import PropTypes from 'prop-types';
import Button from 'Components/buttons/button';
import styles from './styles.styl';
import popoverStyles from 'Components/popover/'

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];
const getTimeFrameId = (timeFrame) => `team-analytics-timeframe-${timeFrame.toLowerCase().replace(/\s/g, '-')}`;

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => (
  <Button decorative size="small" type="tertiary" emoji="downArrow">
    <select className={styles.timeFrameSelect} value={currentTimeFrame} onChange={(e) => updateTimeFrame(e.target.value)}>
      {timeFrames.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
      <span className={popoverStyles.arrowPadding}>
        <span className={popoverStyles.downArrow} />
      </span>
    </select>
  </Button>
);

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
