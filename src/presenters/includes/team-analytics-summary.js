import React from 'react';
import PropTypes from 'prop-types';

const TeamAnalyticsSummary = ({ activeFilter, totalAppViews, totalRemixes }) => {
  if (activeFilter === 'views') {
    return (
      <span className="summary-item">
        <span className="total app-views">{totalAppViews.toLocaleString('en')}</span>
        {' '}
        <div className="summary-label">{totalAppViews === 1 ? "App View" : "App Views"}</div>
      </span>
    );
  }
  if (activeFilter === 'remixes') {
    return (
      <span className="summary-item">
        <span className="total remixes">{totalRemixes.toLocaleString('en')}</span>
        {' '}
        <div className="summary-label">{totalRemixes === 1 ? "Remix" : "Remixes"}</div>
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
