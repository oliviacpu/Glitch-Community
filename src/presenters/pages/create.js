import React from 'react';
import PropTypes from 'prop-types';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Link from 'Components/link';
import Embed from 'Components/project/embed';
import Layout from 'Components/layout';

import styles from './create.styl';

const Mark = ({ color, children }) => (
  <span className={styles.mark} style={{ '--mark-color': color }}>
    <span className={styles.markText}>{children}</span>
  </span>
);

const bannerIllustration = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fillustration.svg?v=1561144073293'
const Banner = () => (
  <div className={styles.banner}>
    <Heading name="h1">
      <Mark>Create</Mark> the app of your dreams
    </Heading>
    <Text>
      Whether you're new to code or an experienced developer, Glitch is the fastest tool for turning your ideas into web aps.
    </Text>
    <Image src={bannerIllustration} alt="" />
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
