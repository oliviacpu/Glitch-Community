import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import NotFound from 'Components/errors/not-found';
import { captureException } from '../../utils/sentry';

import Layout from '../layout';

import { getShowUrl } from '../../models/project';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

export const NotFoundPage = () => (
  <Layout>
    <Helmet title="👻 Page not found" />
    <main className="error-page-container">
      <Image className="error-image" src={telescopeImageUrl} alt="" width="318px" height="297px" />
      <div className="error-msg">
        <Heading tagName="h1">Page Not Found</Heading>
        <Text>Maybe a typo, or perhaps it's moved?</Text>
        <a className="button button-link" href="/">
          Back to Glitch
        </a>
      </div>
    </main>
  </Layout>
);

const emailImageUrl = 'https://cdn.glitch.com/26ac422d-705d-42be-b9cb-1fbdfe7e5a63%2Ferror-mailer.svg?1543429767321';

export const EmailErrorPage = ({ title, description }) => (
  <Layout>
    <Helmet title={`✉️ ${title}`} />
    <main className="error-page-container">
      <img className="error-image email-error-image" src={emailImageUrl} alt="" width="470px" />
      <div className="error-msg">
        <h1>{title}</h1>
        <Text>{description}</Text>
        <a className="button button-link" href="/">
          Back to Glitch
        </a>
      </div>
    </main>
  </Layout>
);

EmailErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const oauthImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

export const OauthErrorPage = ({ title, description }) => (
  <Layout>
    <Helmet title={`🔑 ${title}`} />
    <main className="error-page-container">
      <img className="error-image" src={oauthImageUrl} alt="" width="370px" />
      <div className="error-msg">
        <h1>{title}</h1>
        <Text>{description}</Text>
        <a className="button button-link" href="/">
          Back to Glitch
        </a>
      </div>
    </main>
  </Layout>
);

OauthErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const ProjectNotFoundPage = ({ name }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();

  const check = async () => {
    try {
      const { data } = await api.post(`projects/${name}/appAuthToken`);
      if (data) {
        window.location.replace(getShowUrl(name));
      }
    } catch (error) {
      const status = error && error.response && error.response.status;
      if (status !== 404 && status !== 401) {
        captureException(error);
      }
    }
  };
  React.useEffect(() => {
    check();
  }, [name, currentUser.persistentToken]);

  return (
    <Layout>
      <Helmet title="👻 Project not found" />
      <NotFound name={name} />
      <Text>Either there's no project here, or you don't have access to it. Are you logged in as the right user?</Text>
    </Layout>
  );
};

ProjectNotFoundPage.propTypes = {
  name: PropTypes.string.isRequired,
};
