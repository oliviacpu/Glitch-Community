import React from 'react';
import { uniq } from 'lodash';

import DataLoader from 'Components/data-loader';
import getAllItems from 'Shared/api';

import { Home } from './index';
import { featuredCollections } from '../../../curated/collections'

import exampleData from './example-data';

async function getCultureZine () {
  // TODO: this can be fetched fresh here instead of being cached by the home page
  return window.ZINE_POSTS.map((post) => ({
    id: post.id,
    title: post.title,
    url: post.url,
    img: post.feature_image,
    source: post.primary_tag.name,
  }))
}

async function getUniqueUsersInProjects (api, projects, maxCount) {
  const users = {}
  for await (const project of projects) {
    const projectUsers = await getAllItems(api, `v1/projects/by/id/users?id=${project.id}?limit=100`)
    for (const user of projectUsers) {
      users[user.id] = user
    }
    if (Object.keys(users).length > maxCount) break
  }
  return Object.values(users).slice(0, maxCount)
}

async function getFeaturedCollections (api) {
  const fullUrls = featuredCollections.map(({ owner, name }) => `fullUrl=${owner}/${name}`).join('&')
  const { data: collections } = await api.get(`/v1/collections/by/fullUrl?${fullUrls}`)
  
  // TODO: where should this actually be configured?  
  const styles = ['wavey', 'diagonal', 'triangle']
  
  const collectionsWithData = featuredCollections.map(async ({ owner, name, title, description, style }, i) => {
    const fullUrl = `${owner}/${name}`
    const collection = collections[fullUrl]
    const projects = await getAllItems(api, `/v1/collections/by/fullUrl/projects?fullUrl=${fullUrl}?limit=100`)
    const users = await getUniqueUsersInProjects(api, projects, 5)
    
    return {
      title: title || collection.title,
      description: description || collection.description,
      fullUrl: fullUrl,
      users: users,
      count: projects.length,
      collectionStyle: style || styles[i]
    }
  })
  
  return Promise.all(collectionsWithData)
}


async function getHomeData(api) {
  const [cultureZine, curatedCollections] = await Promise.all([getCultureZine(api), getFeaturedCollections(api)])
  
  console.log(curatedCollections)
  
  return {
    ...exampleData,
    curatedCollections,
    cultureZine
  };
}

const HomePreview = () => <DataLoader get={getHomeData}>{(data) => <Home isPreview data={data} />}</DataLoader>;

export default HomePreview;
