import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout';

import { getEditorUrl } from '../../models/project';
import { AnalyticsContext } from '../analytics';
import { CurrentUserConsumer } from '../current-user';
import { Link } from '../includes/link';

import Featured from '../featured';
import MoreIdeas from '../more-ideas';
import OverlayVideo from '../overlays/overlay-video';
import Questions from '../questions';
import RecentProjects from '../recent-projects';
import ReportButton from '../pop-overs/report-abuse-pop';
import Image from '../../components/image/image';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

const Callout = ({ classes, imgUrl, title, description }) => (
  <div className={`callout ${classes}`}>
    <img className="badge" src={imgUrl} alt={title} />
    <div className="window">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </div>
  </div>
);
Callout.propTypes = {
  classes: PropTypes.string,
  imgUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

Callout.defaultProps = {
  classes: '',
};

class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }

  //<Image className="witch large" src={witchLarge} alt={whatsGlitchAlt} />
//              <img className="witch small" src={witchSmall} alt={whatsGlitchAlt} />

  render() {
    const witchLarge = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-large.svg?1543872118446';
    const witchSmall = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-small.svg?1543872119039';
    const srcSet = `${witchLarge} 1000w`;

    const discover = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fexplore-illustration.svg?1543508598659';
    const remix = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543508529783';
    const collaborate = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543508686482';

    const play = 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg';
    const whatsGlitchAlt = "Glitch is the friendly community where you'll find the app of your dreams";

    return (
      <section className="what-is-glitch">
        <span>
          <figure>
            <h1><Image srcSet={srcSet} src={witchSmall} /></h1>

            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="How it works" />
                <span>How it works</span>
              </div>
            </OverlayVideo>
          </figure>

          <div className="callouts">
            <Callout
              classes="discover"
              imgUrl={discover}
              title="Explore Apps"
              description="Discover over a million free apps built by people like you"
            />
            <Callout classes="remix" imgUrl={remix} title="Remix Anything" description="Edit any project and have your own app running instantly" />
            <Callout classes="collaborate" imgUrl={collaborate} title="Build with Your Team" description="Invite everyone to create together" />{' '}
          </div>
        </span>
      </section>
    );
  }
}

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer" />
    </Link>
  </section>
);

const IndexPage = ({ api, user }) => (
  <main>
    {!user.login && <WhatIsGlitch />}

    {!!user.projects.length && <RecentProjects api={api} />}
    {!!user.login && <Questions api={api} />}
    <Featured isAuthorized={!!user.login} api={api} />
    <MoreIdeas api={api} />
    <MadeInGlitch />
    <ReportButton reportedType="home" />
  </main>
);
IndexPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }).isRequired,
  api: PropTypes.any,
};

IndexPage.defaultProps = {
  api: null,
};

const IndexPageContainer = ({ api }) => (
  <Layout api={api}>
    <AnalyticsContext properties={{ origin: 'index' }}>
      <CurrentUserConsumer>{(user) => <IndexPage api={api} user={user} />}</CurrentUserConsumer>
    </AnalyticsContext>
  </Layout>
);

export default IndexPageContainer;

IndexPageContainer.defaultProps = {
  api: PropTypes.any,
};
