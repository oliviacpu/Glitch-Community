import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.styl';

const depluralize = (str) => str.replace(/e?s$/, '')

export const SummaryItem = ({ total, type, label }) => (
  <span className={style.summaryItem}>
    <span className={classnames(styles.total, styles[type])}>{total.toLocaleString('en')}</span>
    {' '}
    <div className={styles.summaryLabel}>{total === 1 ? depluralize(label) : label}</div>
  </span>
);

const TeamAnalyticsSummary = ({ activeFilter, totalAppViews, totalRemixes }) => (
  <>
    {activeFilter === 'views' && <SummaryItem total={totalAppViews} type="requests" label="App Views" />}
    {activeFilter === 'remixes' && <SummaryItem total={totalAppViews} type="remixes" label="App Views" />}
  </>
) {
  if (activeFilter === 'views') {
    return (
      <span className="summary-item">
        <span className="total app-views">{totalAppViews.toLocaleString('en')}</span>{' '}
        <div className="summary-label">{totalAppViews === 1 ? 'App View' : 'App Views'}</div>
      </span>
    );
  }
  if (activeFilter === 'remixes') {
    return (
      <span className="summary-item">
        <span className="total remixes">{totalRemixes.toLocaleString('en')}</span>{' '}
        <div className="summary-label">{totalRemixes === 1 ? 'Remix' : 'Remixes'}</div>
      </span>
    );
  }
  return null;
};

TeamAnalyticsSummary.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  totalAppViews: PropTypes.number.isRequired,
  totalRemixes: PropTypes.number.isRequired,
};

export default TeamAnalyticsSummary;
