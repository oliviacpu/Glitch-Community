import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { cloneDeep, sumBy } from 'lodash';
import sampleAnalytics, { sampleAnalyticsTime } from 'Curated/sample-analytics';

import Text from 'Components/text/text';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Loader from 'Components/loader';
import { createAPIHook } from 'State/api';

import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop';

import TeamAnalyticsSummary from './team-analytics-summary';
import TeamAnalyticsActivity from './team-analytics-activity';
import TeamAnalyticsReferrers from './team-analytics-referrers';
import TeamAnalyticsProjectDetails from './team-analytics-project-details';


const dateFromTime = (newTime) => {
  const timeMap = {
    'Last 4 Weeks': dayjs()
      .subtract(4, 'weeks')
      .valueOf(),
    'Last 2 Weeks': dayjs()
      .subtract(2, 'weeks')
      .valueOf(),
    'Last 24 Hours': dayjs()
      .subtract(24, 'hours')
      .valueOf(),
  };
  return timeMap[newTime];
};

function getSampleAnalytics () {
  const data = cloneDeep(sampleAnalytics);
  // Update timestamps so they're relative to now
  data.buckets.forEach((bucket) => {
    bucket['@timestamp'] += Date.now() - sampleAnalyticsTime;
  });
  return data;
}

const useAnalyticsData = createAPIHook(async (api, { id, projects, fromDate, currentProjectDomain }) => {
  if (!projects.length) return getSampleAnalytics();
  
  const path = currentProjectDomain ? `analytics/${id}/project/${currentProjectDomain}?from=${fromDate}` : `analytics/${id}/team?from=${fromDate}`;
  return api.get(path);
});

function useAnalytics (props) {
  // make an object with a stable identity so it can be used as single argumnent to api hook
  const memoProps = useMemo(() => props, Object.values(props));
  console.log(props, memoProps);
  return useAnalyticsData(memoProps);
}

function TeamAnalyticsBase ({ id, projects }) {
  const [activeFilter, setActiveFilter] = useState('views');
  
  const [currentTimeFrame, setCurrentTimeFrame] = useState('Last 2 weeks');
  const fromDate = useMemo(() => dateFromTime(currentTimeFrame), [currentTimeFrame]);
  
  const [currentProjectDomain, setCurrentProjectDomain] = useState(''); // empty string means all projects
  
  const { status: analyticsStatus, value: analytics, error } = useAnalytics({ id, projects, fromDate, currentProjectDomain });
  if (error) console.error('getAnalytics', error);
  
  const buckets = analytics ? analytics.buckets : [];
  const { totalAppViews, totalRemixes } = useMemo(() => ({
    totalAppViews: sumBy(buckets, (bucket) => bucket.analytics.visits),
    totalRemixes: sumBy(buckets, (bucket) => bucket.analytics.remixes),
  }), [buckets]);
    
  // segmented button filters
  const buttons = [{ name: 'views', contents: 'App Views' }, { name: 'remixes', contents: 'Remixes' }];

  return (
    <section className="team-analytics">
      <h2>
        Analytics
        {projects.length === 0 && analyticsStatus === 'ready' && (
          <aside className="inline-banners team-page">Add projects to see their stats</aside>
        )}
      </h2>

      {projects.length > 0 && (
        <section className="controls">
          <div className="segmented-buttons-wrap">
            <SegmentedButtons value={activeFilter} buttons={buttons} onChange={setActiveFilter} />
          </div>
          <div className="options">
            <TeamAnalyticsProjectPop
              updateProjectDomain={setCurrentProjectDomain}
              currentProjectDomain={currentProjectDomain}
              projects={projects}
            />
            <TeamAnalyticsTimePop updateTimeFrame={setCurrentTimeFrame} currentTimeFrame={currentTimeFrame} />
          </div>
        </section>
      )}

      <section className="summary">
        {!analytics ? (
          <Loader />
        ) : (
          <TeamAnalyticsSummary
            currentProjectDomain={currentProjectDomain}
            currentTimeFrame={currentTimeFrame}
            activeFilter={activeFilter}
            totalAppViews={totalAppViews}
            totalRemixes={totalRemixes}
          />
        )}
      </section>

      <section className="activity">
        <figure id="chart" className="c3" />
        <TeamAnalyticsActivity
          activeFilter={activeFilter}
          analytics={analytics}
          currentTimeFrame={currentTimeFrame}
        />
      </section>

      <section className="referrers">
        <h3>Referrers</h3>
        {!analytics ? (
          <Loader /> 
        ) : (
          <TeamAnalyticsReferrers
            activeFilter={activeFilter}
            analytics={analytics}
            totalRemixes={totalRemixes}
            totalAppViews={totalAppViews}
          />
        )}
      </section>

      {currentProjectDomain && (
        <section className="project-details">
          <h3>Project Details</h3>
          <TeamAnalyticsProjectDetails
            currentProjectDomain={currentProjectDomain}
            id={id}
            activeFilter={activeFilter}
          />
        </section>
      )}

      <section className="explanation">
        <Text>
          Because Glitch doesn't inject code or cookies into your projects we don't collect the data required for unique app views. You can get
          uniques by adding Google Analytics to your project.
        </Text>
      </section>

      {!projects.length && <div className="placeholder-mask" />}
    </section>
  );
}


TeamAnalyticsBase.propTypes = {
  id: PropTypes.number.isRequired,
  projects: PropTypes.array.isRequired,
};

export default (props) => {
  if (!props.currentUserIsOnTeam) return null 
  return <TeamAnalyticsBase {...props} />;
};
