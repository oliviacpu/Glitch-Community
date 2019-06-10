import React from 'react';
import PropTypes from 'prop-types';
import { sumBy } from 'lodash';

import styles from './styles.styl';

const MAX_REFERRERS = 4;

const ReferrerItem = ({ count, total, description }) => {
  if (count <= 0) return <li>none</li>;

  const progress = Math.max(Math.round((count / total) * 100), 3);
  return (
    <li>
      {count.toLocaleString('en')} – {description}
      <progress value={progress} max="100" />
    </li>
  );
};

ReferrerItem.propTypes = {
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

const filterReferrers = (referrers) => referrers.filter((referrer) => !referrer.self).slice(0, MAX_REFERRERS);

const ReferrerColumn = ({ total, referrers, name, label }) => {
  const totalDirect = total - sumBy(referrers, (referrer) => referrer[name]);
  return (
    <article className="referrers-column app-views">
      <ul>
        <ReferrerItem count={totalDirect} total={total} description={`direct ${label}`} />
        {referrers.map((referrer) => (
          <ReferrerItem key={referrer.domain} count={referrer[name]} total={total} description={referrer.domain} />
        ))}
      </ul>
    </article>
  )
}

const  TeamAnalyticsReferrers = ({ activeFilter, analytics, totalRemixes, totalAppViews }) => (
  <div className="referrers-content">
    {activeFilter === 'views' && (
      <ReferrerColumn 
        name="requests"
        total={totalAppViews}
        referrers={filterReferrers(analytics.referrers)}
        label="views"
      />
    )}
    {activeFilter === 'remixes' && (
      <ReferrerColumn 
        name="remixes"
        total={totalRemixes}
        referrers={filterReferrers(analytics.remixReferrers)}
        label="remixes"
      />
    )}
  </div>
);

TeamAnalyticsReferrers.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  analytics: PropTypes.object.isRequired,
  totalRemixes: PropTypes.number.isRequired,
  totalAppViews: PropTypes.number.isRequired,
};

export default TeamAnalyticsReferrers;
