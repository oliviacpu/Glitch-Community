import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import _ from 'lodash';
import sampleAnalytics, { sampleAnalyticsTime } from 'Curated/sample-analytics';

import Text from 'Components/text/text';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Loader from 'Components/loaders/loader';

import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop';

import TeamAnalyticsSummary from './team-analytics-summary';
import TeamAnalyticsActivity from './team-analytics-activity';
import TeamAnalyticsReferrers from './team-analytics-referrers';
import TeamAnalyticsProjectDetails from './team-analytics-project-details';

import { useAPI } from '../../state/api';

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

const getAnalytics = async ({ id, api, projects, fromDate, currentProjectDomain }) => {
  if (!projects.length) {
    const data = _.cloneDeep(sampleAnalytics);
    // Update timestamps so they're relative to now
    data.buckets.forEach((bucket) => {
      bucket['@timestamp'] += Date.now() - sampleAnalyticsTime;
    });
    return data;
  }
  let path = `analytics/${id}/team?from=${fromDate}`;
  if (currentProjectDomain) {
    path = `analytics/${id}/project/${currentProjectDomain}?from=${fromDate}`;
  }
  try {
    const { data } = await api.get(path);
    return data;
  } catch (error) {
    console.error('getAnalytics', error);
  }
  return null;
};

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
    const currentTimeFrame = 'Last 2 Weeks';
    this.state = {
      activeFilter: 'views',
      currentTimeFrame,
      fromDate: dateFromTime(currentTimeFrame),
      currentProjectDomain: '', // empty string means all projects
      analytics: {},
      c3: {},
      isGettingData: true,
      isGettingC3: true,
      totalRemixes: 0,
      totalAppViews: 0,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    import(/* webpackChunkName: "c3-bundle" */ 'c3').then((c3) => {
      this.setState({
        c3,
        isGettingC3: false,
      });
      if (this.props.currentUserIsOnTeam) {
        this.updateAnalytics();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUserIsOnTeam === false && this.props.currentUserIsOnTeam === true && this.state.isGettingC3 === false) {
      this.updateAnalytics();
    } else if (prevProps.projects.length !== this.props.projects.length && this.state.isGettingC3 === false) {
      this.updateAnalytics();
      // using setState in componentDidUpdate can cause bugs but hopefully it's fine here
      // eslint-disable-next-line
      this.setState({
        currentProjectDomain: '',
      });
    }
  }

  setFilter(filter) {
    this.setState({ activeFilter: filter });
  }

  updateTotals() {
    let totalAppViews = 0;
    let totalRemixes = 0;
    this.state.analytics.buckets.forEach((bucket) => {
      totalAppViews += bucket.analytics.visits;
      totalRemixes += bucket.analytics.remixes;
    });
    this.setState({
      totalAppViews,
      totalRemixes,
    });
  }

  updateAnalytics() {
    this.setState({
      isGettingData: true,
    });

    const { id, api, projects } = this.props;
    const { fromDate, currentProjectDomain } = this.state;
    getAnalytics({ id, api, projects, fromDate, currentProjectDomain }).then((data) => {
      this.setState(
        {
          isGettingData: false,
          analytics: data,
        },
        () => {
          this.updateTotals();
        },
      );
    });
  }

  updateTimeFrame(newTime) {
    this.setState(
      {
        currentTimeFrame: newTime,
        fromDate: dateFromTime(newTime),
      },
      () => {
        this.updateAnalytics();
      },
    );
  }

  updateProjectDomain(newDomain) {
    this.setState(
      {
        currentProjectDomain: newDomain,
      },
      () => {
        this.updateAnalytics();
      },
    );
  }

  render() {
    if (!this.props.currentUserIsOnTeam) {
      return null;
    }

    // segmented button filters
    const buttons = [{ name: 'views', contents: 'App Views' }, { name: 'remixes', contents: 'Remixes' }];

    return (
      <section className="team-analytics">
        <h2>
          Analytics
          {this.props.projects.length === 0 && !this.state.isGettingData && (
            <aside className="inline-banners team-page">Add projects to see their stats</aside>
          )}
        </h2>

        {!!this.props.projects.length && (
          <section className="controls">
            <SegmentedButtons value={this.state.activeFilter} buttons={buttons} onChange={this.setFilter.bind(this)} />
            <div className="options">
              <TeamAnalyticsProjectPop
                updateProjectDomain={this.updateProjectDomain.bind(this)}
                currentProjectDomain={this.state.currentProjectDomain}
                projects={this.props.projects}
              />
              <TeamAnalyticsTimePop updateTimeFrame={this.updateTimeFrame.bind(this)} currentTimeFrame={this.state.currentTimeFrame} />
            </div>
          </section>
        )}

        <section className="summary">
          {this.state.isGettingData ? (
            <Loader />
          ) : (
            <TeamAnalyticsSummary
              currentProjectDomain={this.state.currentProjectDomain}
              currentTimeFrame={this.state.currentTimeFrame}
              activeFilter={this.state.activeFilter}
              totalAppViews={this.state.totalAppViews}
              totalRemixes={this.state.totalRemixes}
            />
          )}
        </section>

        <section className="activity">
          <figure id="chart" className="c3" />
          {(this.state.isGettingData || this.state.isGettingC3) && <Loader />}
          {!this.state.isGettingC3 && (
            <TeamAnalyticsActivity
              activeFilter={this.state.activeFilter}
              c3={this.state.c3}
              analytics={this.state.analytics}
              isGettingData={this.state.isGettingData}
              currentTimeFrame={this.state.currentTimeFrame}
            />
          )}
        </section>

        <section className="referrers">
          <h3>Referrers</h3>
          {(this.state.isGettingData && <Loader />) || (
            <TeamAnalyticsReferrers
              activeFilter={this.state.activeFilter}
              analytics={this.state.analytics}
              totalRemixes={this.state.totalRemixes}
              totalAppViews={this.state.totalAppViews}
            />
          )}
        </section>

        {this.state.currentProjectDomain && (
          <section className="project-details">
            <h3>Project Details</h3>
            <TeamAnalyticsProjectDetails
              currentProjectDomain={this.state.currentProjectDomain}
              id={this.props.id}
              activeFilter={this.state.activeFilter}
            />
          </section>
        )}

        <section className="explanation">
          <Text>
            Because Glitch doesn't inject code or cookies into your projects we don't collect the data required for unique app views. You can get
            uniques by adding Google Analytics to your project.
          </Text>
        </section>

        {!this.props.projects.length && <div className="placeholder-mask" />}
      </section>
    );
  }
}

TeamAnalytics.propTypes = {
  api: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  projects: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default (props) => {
  const api = useAPI();
  return <TeamAnalytics {...props} api={api} />;
};
