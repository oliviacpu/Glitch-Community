import React from 'react';
import { pick } from 'lodash';

import DataLoader from 'Components/data-loader';
import Button from 'Components/buttons/button';
import { getAllPages, allByKeys } from 'Shared/api';

import { featuredCollections } from '../../../curated/collections'
import featuredProjects from '../../../curated/featured'
import featuredEmbed from '../../../curated/featured-embed'
import unifiedStories from '../../../curated/unified-stories'
import { featureCallouts, buildingOnGlitch } from '../../../curated/home-features'

import Layout from '../../layout';
import { Home } from './index';
import exampleData from './example-data';
import styles from './styles.styl';

const PreviewBanner = () => (
  <div className={styles.previewBanner}>
    <p>This is a live preview of your edits to the home page.</p>
    <Button type="cta" decorative>
      Publish
    </Button>
  </div>
);

const HomePreview = () => (
  <Layout>
    <PreviewBanner />
    <DataLoader get={(api) => api.get(`${window.location.origin}/api/home.json`)}>
      {(data) => <Home data={data} />}
    </DataLoader>
  </Layout>
  
);

export default HomePreview;
