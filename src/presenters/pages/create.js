import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { values, sampleSize } from 'lodash';

import Image from 'Components/images/image';
import { TeamAvatar, ProjectAvatar } from 'Components/images/avatar';
import Text from 'Components/text/text';
import Markdown from 'Components/text/markdown';
import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';
import Link from 'Components/link';
import Embed from 'Components/project/embed';
import Layout from 'Components/layout';
import Loader from 'Components/loader';
import { useAPI } from 'State/api';
import { getRemixUrl, getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import { getLink as getTeamLink } from 'Models/team';

import styles from './create.styl';

const Mark = ({ color, children }) => (
  <span className={styles.mark} style={{ '--mark-color': color }}>
    <span className={styles.markText}>{children}</span>
  </span>
);

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

const bannerIllustration = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fillustration.svg?v=1561144073293';
const bannerShape = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fshape-pattern.svg?v=1561146220750';
const Banner = () => (
  <section className={styles.banner}>
    <div className={styles.bannerText}>
      <Heading className={styles.bannerTagline} tagName="h1">
        <Mark color="#fbf2b8">Create</Mark>
        <Unmarked>the app of your dreams</Unmarked>
      </Heading>
      <Text>Whether you're new to code or an experienced developer, Glitch is the fastest tool for turning your ideas into web apps.</Text>
      <span className={styles.bannerRemixBtn}>
        <Button href={getRemixUrl(name)} type="cta">
          Remix Hello World
        </Button>
      </span>
    </div>

    <div className={styles.bannerIllustration}>
      <Image src={bannerIllustration} alt="" />
    </div>
  </section>
);

const WhatIsGlitch = () => (
  <section className={classNames(styles.section, styles.whatIsGlitch)}>
    <div>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#d7a6f9">What is Glitch?</Mark>
      </Heading>
      <div className={classNames(styles.sectionDescription, styles.whatIsGlitchDescription)}>
        <Text size="15px">Glitch is a collaborative programming environment that lives in your browser and deploys your code as you type.</Text>
        <Text size="15px">Use Glitch to build anything from static webpages to fullstack Node apps.</Text>
      </div>
    </div>
    <div className={styles.whatIsGlitchVideo} />
  </section>
);

const FRAMEWORK_STARTERS = [
  {
    name: 'React',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Freact-logo.png?v=1561160699261',
    color: '#000',
    domain: 'starter-react',
  },
  {
    name: 'Ember',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fember-logo.png?v=1561160695744',
    color: '#f8d1d5',
    domain: 'ember',
  },
  {
    name: 'Nuxt',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fnuxt-logo.png?v=1561160716701',
    color: '#ebfef5',
    domain: 'nuxt-hello-world',
  },
  {
    name: 'Vue',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fvue-logo.png?v=1561160722208',
    color: '#ccfde5',
    domain: 'vue-ssr',
  },
  {
    name: 'Angular',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fangular.png?v=1561160794919',
    color: '#f9dcd1',
    domain: 'angular-quickstart',
  },
  {
    name: 'Svelte',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fsvelte-logo.png?v=1561160701052',
    color: '#f6c6b4',
    domain: 'sveltejs-template-starter',
  },
];
const PLATFORM_STARTERS = ['slack', 'twitchdev', 'material', 'trello', 'spotify', 'aframe'];
const frameworkBlob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fblob-framework.svg?v=1561160086857';
const platformBlob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fblob-platforms.svg?v=1561160088057';

const FrameworkStarterItem = (app) => (
  <div style={{ '--color': app.color }} className={styles.frameworkStarter} key={app.domain}>
    <span className={styles.frameworkLogo}>
      <Image src={app.logo} alt="" />
    </span>
    <span>
      <Heading tagName="h4">{app.name}</Heading>
      <Button size="small" href={getRemixUrl(app.domain)}>
        Remix {app.name} starter
      </Button>
    </span>
  </div>
);

function PlatformStarterItem(team) {
  const bgColors = {
    slack: '#f9d6c6',
    material: '#b8ebe6',
    twitchdev: '#eeecfb',
    trello: '#dde5e9',
    aframe: '#aad6fb',
    spotify: '#d3f3e6',
  };

  return (
    <div className={styles.platformStarter} style={{ backgroundColor: bgColors[team.url] }} key={team.id}>
      <div className={styles.platformLogo}>
        <TeamAvatar team={team} hideTooltip />
      </div>
      <div>
        <div className={styles.platformLink}>
          <Button href={getTeamLink(team)}>{team.name}</Button>
        </div>
        <Text size="14px">
          <Markdown renderAsPlaintext>{team.description}</Markdown>
        </Text>
      </div>
    </div>
  );
}
function Starters() {
  const [platformStarters, setPlatformStarters] = useState(null);
  const api = useAPI();
  useEffect(() => {
    const fetchTeams = async () => {
      const url = `/v1/teams/by/url?url=${PLATFORM_STARTERS.join('&url=')}`;
      const { data } = await api.get(url);
      setPlatformStarters(values(data));
    };
    fetchTeams();
  }, []);
  return (
    <section className={classNames(styles.section, styles.starters)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#F9DB91">Starters for all developers</Mark>
      </Heading>
      <Text className={classNames(styles.sectionDescription, styles.startersDescription)} size="15px">
        Remixable working apps mean you never have to start from scratch. You can even{' '}
        <Link to="https://glitch.com/help/import-git/">clone a git repo from services like GitHub and GitLab</Link> to make a copy and deploy on
        Glitch.
      </Text>

      <div className={classNames(styles.startersSection, styles.startersGrid)}>
        <div className={styles.startersInfo} style={{ backgroundImage: `url(${frameworkBlob})` }}>
          <Heading className={classNames(styles.startersHeading, styles.h3)} tagName="h3">
            Framework starters
          </Heading>
          <Text size="15px">Build off the most popular JavaScript frameworks</Text>
        </div>
        {FRAMEWORK_STARTERS.map(FrameworkStarterItem)}
      </div>

      <div className={classNames(styles.startersSection, styles.startersGrid)}>
        <div className={styles.startersInfo} style={{ backgroundImage: `url(${platformBlob})` }}>
          <Heading className={classNames(styles.startersHeading, styles.h3)} tagName="h3">
            Platform starters
          </Heading>
          <Text size="15px">Your favorite companies use Glitch to share quickstart apps for getting up and running with their APIs.</Text>
        </div>
        {platformStarters ? platformStarters.map(PlatformStarterItem) : <Loader />}
      </div>
    </section>
  );
}

function Collaborate() {
  const title = 'Build collaboratively';
  const description =
    'Invite friends to work alongside you, right in the same project. Anyone with a browser can jump in and pick up where you left off.';
  const highlights = [
    'Work on public or private projects',
    'Secrets like API keys are stored in a private .env file only accessible to your collaborators',
  ];
  const video = 'https://cdn.glitch.com/170fbc25-c897-4ada-867b-7253ece0859a%2Fcollaboration-large.mp4?v=1560968406269';
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbean.svg?v=1561410252567';
  const pyramid = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fpyramid.svg?v=1561410495436';

  return (
    <ScreencapSection
      title={title}
      description={description}
      highlights={highlights}
      video={video}
      blob={blob}
      image={pyramid}
      imageName="pyramid"
      markColor="#c9c4fa"
    />
  );
}

function YourAppIsLive() {
  const title = 'Your app is live, instantly';
  const description =
    "There's no deployment setup—as soon as you create a new project, your Glitch app is live with its own URL. Share or embed your app anywhere, and invite others to check out your code or remix it.";
  const highlights = ['Supports custom domains'];
  const video = 'https://cdn.glitch.com/170fbc25-c897-4ada-867b-7253ece0859a%2Flive-large.mp4?v=1560957595266';
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwhale.svg?v=1561410916138';
  const mic = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive.svg?v=1561410952941';

  return (
    <ScreencapSection
      title={title}
      description={description}
      highlights={highlights}
      video={video}
      blob={blob}
      image={mic}
      imageName="mic"
      markColor="#c9fafe"
    />
  );
}

function ScreencapSection({ title, description, video, highlights, blob, image, imageName, markColor }) {
  return (
    <section className={styles.section}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color={markColor}>{title}</Mark>
      </Heading>

      <Text className={classNames(styles.sectionDescription, styles.screencapDescription)} size="15px">
        {description}
      </Text>

      <div className={styles.screencapContainer}>
        <video autoPlay="" loop="" muted="">
          <source src={video} />
        </video>

        <div className={styles.screencapImageContainer}>
          <div className={styles.screencapBlob}>
            <Image src={blob} alt="" />
          </div>
          <div className={classNames(styles[imageName], styles.screencapImage)}>
            <Image src={image} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.screencapHighlights}>
        {highlights.map((highlight, i) => (
          <Text className={styles.screencapHighlight} key={i}>
            {highlight}
          </Text>
        ))}
      </div>
    </section>
  );
}

function Help() {
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fboomerang.svg?v=1561416296360';
  const ambulance = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ffiretruck.svg?v=1561416321109';

  return (
    <section className={classNames(styles.section, styles.help)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#f8d3c9">Help whenever you need it</Mark>
      </Heading>
      <Text className={styles.sectionDescription}>Still have questions about Glitch? We're here to lend a hand.</Text>

      <div className={styles.helpLinks}>
        <div>
          <Heading tagName="h3">Help Center</Heading>
          <Text>The best place to find answers to FAQs.</Text>
          <Text>
            <Button href="https://glitch.com/help">
              Help Center <span aria-hidden="true">&rarr;</span>
            </Button>
          </Text>
        </div>
        <hr />
        <div>
          <Heading tagName="h3">Support Forum</Heading>
          <Text>Personalized support for your app-specific questions.</Text>
          <Text>
            <Button href="https://support.glitch.com">
              Forums <span aria-hidden="true">&rarr;</span>
            </Button>
          </Text>
        </div>

        <span className={classNames(styles.helpImage, styles.screencapImageContainer)}>
          <div className={styles.screencapBlob}>
            <Image src={blob} alt="" />
          </div>
          <div className={classNames(styles.ambulance, styles.screencapImage)}>
            <Image src={ambulance} alt="" />
          </div>
        </span>
      </div>
    </section>
  );
}

function Remix() {
  const allApps = [
    'starter-chartjs',
    'starter-leaflet',
    'starter-react',
    'data-dashboard',
    'hello-tensorflow',
    'airtable-example',
    'float-layout',
    'hello-magenta',
  ];
  const api = useAPI();
  const [apps, setApps] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  
  useEffect(() => {
    const fetchApps = async (domains) => {
      const url = `/v1/projects/by/domain?domain=${allApps.join('&domain=')}`;
      const { data } = await api.get(url);
      setApps(values(data));
    };
    fetchApps(sampleSize(allApps, 5));
  }, []);
  
  useEffect(() => {
    setCurrentApp(apps[0])
  }, [apps]);

  return (
    <section className={classNames(styles.section, styles.remix)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#FBF2B8">Remix any app to get started</Mark>
      </Heading>

      <Tabs>
        <TabList className={styles.remixAppTabs}>
          {apps.map(app => (
            <Tab onSelect={() => setCurrentApp(app)} className={styles.remixAppTab} key={app.domain}>
              <ProjectAvatar project={app} hideTooltip />
              {app.domain}
            </Tab>
          ))}
        </TabList>
        
        {apps.map(app => (
          <TabPanel>
            <div className={styles.embedContainer}><Embed domain={app.domain} /></div>
            <div className={styles.embedRemixBtn}>
              {currentApp && (
                <Button type="cta" href={getRemixUrl(app.domain)} emoji="microphone">
                  Remix your own
                </Button>
              )}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </section>
  );
}

const CreatePage = () => (
    <main className={styles.main}>
      <Banner />
      <WhatIsGlitch />
      <Starters />
      <Collaborate />
      <YourAppIsLive />
      <Help />
      <Remix />
    </main>
);

export default CreatePage;
