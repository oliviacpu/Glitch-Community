import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sumBy } from 'lodash';

import styles from './styles.styl';

const MAX_REFERRERS = 4;

const ReferrerItem = ({ count, total, description }) => {
  if (count <= 0) return null;

  const progress = Math.max(Math.round((count / total) * 100), 3);
  return (
    <li>
      {count.toLocaleString('en')} – {description}
      <progress value={progress} max="100" />
    </li>
  );
};

const ReferrersColumn = ({ total, referrers, name, label }) => {
  const totalDirect = total - sumBy(referrers, (referrer) => referrer[name]);
  return (
    <article className={classnames(styles.referrersColumn, styles[name])}>
      {total === 0 && 'none'}
      <ul className={styles.referrersList}>
        <ReferrerItem count={totalDirect} total={total} description={`direct ${label}`} />
        {referrers.map((referrer) => (
          <ReferrerItem key={referrer.domain} count={referrer[name]} total={total} description={referrer.domain} />
        ))}
      </ul>
    </article>
  )
}

const filterReferrers = (referrers) => referrers.filter((referrer) => !referrer.self).slice(0, MAX_REFERRERS);

const  TeamAnalyticsReferrers = ({ activeFilter, analytics, totalRemixes, totalAppViews }) => (
  <div className={styles.referrersContent}>
    {activeFilter === 'views' && (
      <ReferrersColumn 
        name="requests"
        total={totalAppViews}
        referrers={filterReferrers(analytics.referrers)}
        label="views"
      />
    )}
    {activeFilter === 'remixes' && (
      <ReferrersColumn 
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
