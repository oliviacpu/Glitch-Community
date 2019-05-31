import React from 'react';

import DataLoader from 'Components/data-loader';

import { Home } from './index';
import exampleData from './example-data';

async function getCultureZine (api) {
  // TODO: this can be fetched fresh here instead of being cached by the home page
  return window.ZINE_POSTS.map(formatCultureZinePost)
}

function formatCultureZinePost(post) {
  return {
    id: '5cc884da8ce5b5009ac694f0',
    title: 'Episode 296: Shar Biggers',
    url: '/revisionpath-shar-biggers/',
    img: '/culture/content/images/2019/04/glitch-shar-biggers.jpg',
    source: 'Revision Path',
  }
}

async function getHomeData(api) {
  const [cultureZine] = await Promise.all([getCultureZine(api)])
  
  return {
    ...exampleData,
    cultureZine
  };
}

const HomePreview = () => <DataLoader get={getHomeData}>{(data) => <Home isPreview data={data} />}</DataLoader>;

export default HomePreview;
