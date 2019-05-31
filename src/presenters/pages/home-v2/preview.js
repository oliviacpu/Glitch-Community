import React from 'react';

import DataLoader from 'Components/data-loader';

import { Home } from './index';
import data from './example-data';

async function getHomeData() {
  return data;
}

const HomePreview = () => <DataLoader get={getHomeData}>{(data) => <Home isPreview data={data} />}</DataLoader>;

export default HomePreview;
