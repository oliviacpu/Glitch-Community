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

const userProps = ['id', 'avatarUrl', 'avatarThumbnailUrl', 'login', 'name', 'location', 'color', 'description', 'hasCoverImage', 'coverColor','thanksCount', 'utcOffset']
const trimUserProps = (user) => pick(user, userProps)

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
    const projectUsers = await getAllPages(api, `v1/projects/by/id/users?id=${project.id}&limit=100`)
    for (const user of projectUsers) {
      users[user.id] = user
    }
    if (Object.keys(users).length > maxCount) break
  }
  return Object.values(users)
}

async function getFeaturedCollections (api) {
  const fullUrls = featuredCollections.map(({ owner, name }) => `fullUrl=${owner}/${name}`).join('&')
  const { data: collections } = await api.get(`/v1/collections/by/fullUrl?${fullUrls}`)
  
  // TODO: where should this actually be configured?  
  const styles = ['wavey', 'diagonal', 'triangle']
  
  const collectionsWithData = featuredCollections.map(async ({ owner, name, title, description, style }, i) => {
    const fullUrl = `${owner}/${name}`
    const collection = collections[fullUrl]
    const projects = await getAllPages(api, `/v1/collections/by/fullUrl/projects?fullUrl=${fullUrl}&limit=100`)
    const users = await getUniqueUsersInProjects(api, projects, 5)
    
    return {
      title: title || collection.name,
      description: description || collection.description,
      fullUrl: fullUrl,
      users: users.map(trimUserProps),
      count: projects.length,
      collectionStyle: style || styles[i]
    }
  })
  
  return Promise.all(collectionsWithData)
}

async function getFeaturedProjects (api) {
  const projectsWithDomains = featuredProjects.map(project => ({ ...project, domain: project.link.split('~')[1] }))
  const domains = projectsWithDomains.map(p => `domain=${p.domain}`).join('&')
  const { data: projectData } = await api.get(`/v1/projects/by/domain?${domains}`)
  const projectsWithData = projectsWithDomains.map(async ({ title, img, link, domain, description }) => {
    const project = projectData[domain]
    const users = await getAllPages(api, `/v1/projects/by/domain/users?domain=${domain}&limit=100`)
    return {
      domain,
      title,
      img,
      users: users.slice(0, 10).map(trimUserProps),
      description: description || project.description,
    }
  }) 
  return Promise.all(projectsWithData)
}

async function getFeaturedEmbed (api) {
  const users = await getAllPages(api, `/v1/projects/by/domain/users?domain=${featuredEmbed.appDomain}&limit=100`)
  return {
    domain: featuredEmbed.appDomain,
    title: featuredEmbed.title,
    description: featuredEmbed.body,
    users: users.slice(0, 10).map(trimUserProps),
  }
}

async function getUnifiedStories () {
  return unifiedStories;
}

async function getFeatureCallouts () {
  return featureCallouts.map(callout => ({ ...callout, id: callout.href }))
}

async function getBuildingOnGlitch() {
  return buildingOnGlitch
}

async function getHomeData(api) {
  const data = await allByKeys({
    cultureZine: getCultureZine(api),
    curatedCollections: getFeaturedCollections(api),
    appsWeLove: getFeaturedProjects(api),
    featuredEmbed: getFeaturedEmbed(api),
    unifiedStories: getUnifiedStories(api),
    featureCallouts: getFeatureCallouts(api),
    buildingOnGlitch: getBuildingOnGlitch(api),
  })
  const json = JSON.stringify(data)
  console.log(`Payload size: ${Math.round(json.length / 1024)} KB`)
  return data
}

const PreviewBanner = () => (
  <div className={styles.previewBanner}>
    <p>This is a live preview of your edits to the home page.</p>
    <Button type="cta" decorative>
      Publish
    </Button>
    <Button decorative>Reset</Button>
  </div>
);

const HomePreview = () => (
  <Layout>
    <PreviewBanner />
    <DataLoader get={getHomeData}>
      {(data) => <Home data={data} />}
    </DataLoader>
  </Layout>
  
);

export default HomePreview;
