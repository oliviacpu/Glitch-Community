import React from 'react';
import PropTypes from 'prop-types';
import { sumBy } from 'lodash';

const MAX_REFERRERS = 4;

const ReferrerPlaceholder = ({ count }) => {
  if (count === 0) return 'none';
  return null;
};

const ReferrerItem = ({ count, total, description }) => {
  const progress = Math.max(Math.round((count / total) * 100), 3);
  if (count <= 0) {
    return null;
  }
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

const ReferrerColumn = ({ total, referrers, description }) => {
  const totalDirect = total - sumBy(referrers, (referrer) => referrer.requests);
  return (
    <article className="referrers-column app-views">
      <ul>
        <ReferrerPlaceholder count={total} />
        <ReferrerItem count={totalDirectAppViews} total={total} description={description} />
        {referrers.map((referrer) => (
          <ReferrerItem key={referrer.domain} count={referrer.requests} total={total} description={referrer.domain} />
        ))}
      </ul>
    </article>
  )
}


const  TeamAnalyticsReferrers = ({ activeFilter, analytics, totalRemixes, totalAppViews }) => {
  const appViewReferrers = filterReferrers(analytics.referrers);
  const remixReferrers = filterReferrers(analytics.remixReferrers);
  const totalDirectAppViews = totalAppViews - sumBy(appViewReferrers, (referrer) => referrer.requests);
  const totalDirectRemixes = totalRemixes - sumBy(remixReferrers, (referrer) => referrer.remixes);
  return (
    <div className="referrers-content">
      {activeFilter === 'views' && (
        <article className="referrers-column app-views">
          <ul>
            <ReferrerPlaceholder count={totalAppViews} />
            <ReferrerItem count={totalDirectAppViews} total={totalAppViews} description="direct views" />
            {appViewReferrers.map((referrer) => (
              <ReferrerItem key={referrer.domain} count={referrer.requests} total={totalAppViews} description={referrer.domain} />
            ))}
          </ul>
        </article>
      )}
      {activeFilter === 'remixes' && (
        <article className="referrers-column remixes">
          <ul>
            <ReferrerPlaceholder count={totalRemixes} />
            <ReferrerItem count={totalDirectRemixes} total={totalRemixes} description="direct remixes" />
            {remixReferrers.map((referrer) => (
              <ReferrerItem key={referrer.domain} count={referrer.remixes} total={totalRemixes} description={referrer.domain} />
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}

TeamAnalyticsReferrers.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  analytics: PropTypes.object.isRequired,
  totalRemixes: PropTypes.number.isRequired,
  totalAppViews: PropTypes.number.isRequired,
};

export default TeamAnalyticsReferrers;
