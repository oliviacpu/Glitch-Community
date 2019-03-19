import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { captureException } from '../../utils/sentry';

import { getLink } from '../../models/team';
import { useCurrentUserActions } from '../../state/current-user';
import { useAPI } from '../../state/api';
import { useNotifications } from '../notifications';

class JoinTeamPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }

  async componentDidMount() {
    let teamId = null;
    try {
      const response = await this.props.api.get(`/teamId/byUrl/${this.props.teamUrl}`);
      teamId = response.data;
    } catch (error) {
      if (error && !(error.response && error.response.status === 404)) {
        captureException(error);
      }
    }
    if (!teamId) {
      // Either the api is down or the team doesn't exist
      // Regardless we can't really do anything with this
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
      this.setState({ redirect: getLink({ url: this.props.teamUrl }) });
      return;
    }
    try {
      // Suppress the authorization header to prevent user merging
      const { data: user } = await this.props.api.post(`/teams/${teamId}/join/${this.props.joinToken}`);
      if (user) {
        this.props.replaceCurrentUser(user);
      }
      this.props.createNotification('Invitation accepted');
    } catch (error) {
      // The team is real but the token didn't work
      // Maybe it's been used already or expired?
      console.log('Team invite error', error && error.response && error.response.data);
      if (error && error.response.status !== 401) {
        captureException(error);
      }
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
    }
    this.setState({ redirect: getLink({ url: this.props.teamUrl }) });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return null;
  }
}
JoinTeamPageBase.propTypes = {
  api: PropTypes.any.isRequired,
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  replaceCurrentUser: PropTypes.func.isRequired,
};

const JoinTeamPage = (props) => {
  const { loggedIn } = useCurrentUserActions();
  const api = useAPI();
  const notify = useNotifications();
  return <JoinTeamPageBase replaceCurrentUser={loggedIn} api={api} {...notify} {...props} />;
};

export default JoinTeamPage;
