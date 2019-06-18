import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { captureException } from 'Utils/sentry';

const JoinTeamPage = withRouter(({ history, teamUrl, joinToken }) => {
  const api = useAPI();
  const { login: replaceCurrentUser } = useCurrentUser();
  const { createNotification } = useNotifications();

  useEffect(() => {
    (async () => {
      try {
        const { data: user } = await api.post(`/teams/join/${joinToken}`);
        if (user) {
          replaceCurrentUser(user);
        }
        createNotification('Invitation accepted');
      } catch (error) {
        // The team is real but the token didn't work
        // Maybe it's been used already or expired?
        console.log('Team invite error', error && error.response && error.response.data);
        if (error && error.response.status !== 401) {
          captureException(error);
        }
        createNotification('Invite failed, try asking your teammate to resend the invite', { type: 'error' });
      }
      history.push(getLink({ url: teamUrl }));
    })();
  }, []);

  return null;
});

JoinTeamPage.propTypes = {
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
};
export default JoinTeamPage;
