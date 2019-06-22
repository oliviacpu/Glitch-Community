import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Link from 'Components/link';
import Embed from 'Components/project/embed';
import Layout from 'Components/layout';
import { getRemixUrl } from '../../models/project';

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
  <section className={styles.whatIsGlitch}>
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

const STARTER_APPS = [
  {
    name: 'React',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Freact-logo.png?v=1561160699261',
    color: '',
    domain: 'starter-react',
  },
  {
    name: 'Ember',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fember-logo.png?v=1561160695744',
    color: '',
    domain: 'ember',
  },
  {
    name: 'Nuxt',
    logo: '',
    color: '',
    domain: 'nuxt-hello-world',
  },
  {
    name: 'Vue',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fvue-logo.png?v=1561160722208',
    color: '',
    domain: 'vue-ssr',
  },
  {
    name: 'Angular',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fangular.png?v=1561160794919',
    color: '',
    domain: 'angular-quickstart',
  },
  {
    name: 'Svelte',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fsvelte-logo.png?v=1561160701052',
    color: '',
    domain: 'sveltejs-template-starter',
  },
];
const Starters = () => (
  <section className={styles.starters}>
    <Heading className={styles.h2} tagName="h2">
      <Mark color="#F9DB91">Starters for all developers</Mark>
    </Heading>
    <Text className={classNames(styles.sectionDescription, styles.startersDescription)} size="15px">
      Remixable working apps mean you never have to start from scratch. You can even{' '}
      <Link to="https://glitch.com/help/import-git/">clone a git repo from services like GitHub and GitLab</Link> to make a copy and deploy on Glitch.
    </Text>
  </section>
);

const StarterItem = (app) => (
  <div>
    <Image src={app.logo} alt="" />
    <div>
      <Heading tagName="h4">{app.name}</Heading>
      <Button size="small" href={getRemixUrl(app.domain)}>Remix {app.name} starter</Button>
    </div>
  </div>
);

const CreatePage = () => (
  <Layout>
    <main class={styles.main}>
      <Banner />
      <WhatIsGlitch />
      <Starters />
    </main>
  </Layout>
);

export default CreatePage;
