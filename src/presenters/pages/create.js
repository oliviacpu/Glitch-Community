import React from 'react';
import PropTypes from 'prop-types';

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

const bannerIllustration = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fillustration.svg?v=1561144073293'
const bannerShape = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fshape-pattern.svg?v=1561146220750';
const Banner = () => (
  <div className={styles.banner}>
    <div className={styles.bannerText}>
      <Heading tagName="h1">
        <Mark color="#fbf2b8">Create</Mark><Unmarked>the app of your dreams</Unmarked>
      </Heading>
      <Text>
        Whether you're new to code or an experienced developer, Glitch is the fastest tool for turning your ideas into web aps.
      </Text>
      <Button href={getRemixUrl(name)} type="cta">Remix Hello World</Button>
    </div>
    
    <div className={styles.bannerIllustration}>
      <Image src={bannerIllustration} alt="" />
    </div>
  </div>
)

const CreatePage = () => {
  return (
    <Layout>
      <Banner />
    </Layout>
  );
};

export default CreatePage;
