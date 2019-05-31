import React from 'react';

import DataLoader from 'Components/data-loader';

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
  const fullUrls = featuredCollections.map(({ owner, name }) => `fullUrl=${owner}/${name}`).join('&')
  const { data } = await api.get(`/v1/collections/by/fullUrl?${fullUrls}`)
  const users
  
  return featuredCollections.map(({ owner, name }) => {
    const collection = data[`${owner}/${name}`]
    return {
      title: collection.title,
      description: collection.description,
      fullUrl: 'glitch/glitch-this-week-may-29-2019',
      users: shuffle(Object.values(users)),
      count: 11,
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
