import React from 'react';

import DataLoader from 'Components/data-loader';

import { Home } from './index';
import exampleData from './example-data';

async function getCultureZine (api) {
  
}

async function getHomeData() {
  return {
    ...exampleData,
  };
}

const HomePreview = () => <DataLoader get={getHomeData}>{(data) => <Home isPreview data={data} />}</DataLoader>;

export default HomePreview;
