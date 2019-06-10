import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

const TeamAnalyticsSummary = ({ activeFilter, totalAppViews, totalRemixes }) => {
  if (activeFilter === 'views') {
    return (
      <span className="summary-item">
        <span className="total app-views">{totalAppViews.toLocaleString('en')}</span>{' '}
        <Pluralize className="summary-label" singular="App View" plural="App Views" count={totalAppViews} showCount={false} />
      </span>
    );
  }
  if (activeFilter === 'remixes') {
    return (
      <span className="summary-item">
        <span className="total remixes">{totalRemixes.toLocaleString('en')}</span>{' '}
        <Pluralize className="summary-label" singular="Remix" plural="Remixes" count={totalRemixes} showCount={false} />
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
