import React from 'react';
import { uniq } from 'lodash';

import DataLoader from 'Components/data-loader';
import getAllItems from 'Shared/api';

import { Home } from './index';
import { featuredCollections } from '../../../curated/collections'

import exampleData from './example-data';

async function getCultureZine (api) {
  // TODO: this can be fetched fresh here instead of being cached by the home page
  return window.ZINE_POSTS.map((post) => ({
    id: post.id,
    title: post.title,
    url: post.url,
    img: post.feature_image,
    source: post.primary_tag.name,
  }))
}

async function getFeaturedCollections (api) {
  const fullUrls = featuredCollections.map(({ owner, name }) => `${owner}/${name}`)
  const { data: collections } = await api.get(`/v1/collections/by/fullUrl?${fullUrls.map(fullUrl => `fullUrl=${fullUrl}`).join('&')}`)
  
  return fullUrls.map(async (fullUrl) => {
    const collection = collections[fullUrl]
    const projects = await getAllItems(api, `/v1/collections/by/fullUrl/projects?fullUrl=${fullUrl}?limit=100`)
    let users = []
    for (const project of projects) {
      const projectUsers = await getAllItems 
    }
    
    
    return {
      title: collection.title,
      description: collection.description,
      fullUrl: fullUrl,
      users: 
      count: projects.length,
      collectionStyle: 'wavey',
    }
  })
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
