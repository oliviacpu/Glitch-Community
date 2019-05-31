const { pick } = require('lodash')
const axios = require('axios');

const { API_URL } = require('./constants').current;
const { getAllPages, allByKeys } = require('Shared/api');

const { getZine } = require('./api') 
const { featuredCollections } = require('../src/curated/collections')
const featuredProjects = require('../src/curated/featured')
const featuredEmbed = require('../src/curated/featured-embed')
const unifiedStories = require('../src/curated/unified-stories')
const { featureCallouts, buildingOnGlitch } = require('../src/curated/home-features')

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Trimming the user props to only what is needed for rendering their avatar tooltip reduces the payload size by half!
const userProps = ['id', 'avatarUrl', 'avatarThumbnailUrl', 'login', 'name', 'color', 'hasCoverImage', 'coverColor']
const trimUserProps = (user) => pick(user, userProps)

async function getCultureZine () {
  const posts = await getZine()
  return posts.slice(0, 4).map((post) => ({
    id: post.id,
    title: post.title,
    url: post.url,
    img: post.feature_image,
    source: post.primary_tag.name,
  }))
}

async function getUniqueUsersInProjects (projects, maxCount) {
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

async function getFeaturedCollections () {
  const fullUrls = featuredCollections.map(({ owner, name }) => `fullUrl=${owner}/${name}`).join('&')
  const { data: collections } = await api.get(`/v1/collections/by/fullUrl?${fullUrls}`)
  
  // TODO: where should this actually be configured?  
  const styles = ['wavey', 'diagonal', 'triangle']
  
  const collectionsWithData = featuredCollections.map(async ({ owner, name, title, description, style }, i) => {
    const fullUrl = `${owner}/${name}`
    const collection = collections[fullUrl]
    const projects = await getAllPages(api, `/v1/collections/by/fullUrl/projects?fullUrl=${fullUrl}&limit=100`)
    const users = await getUniqueUsersInProjects(projects, 5)
    
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

async function getFeaturedProjects () {
  const projectsWithDomains = featuredProjects.map(project => ({ ...project, domain: project.link.split('~')[1] }))
  const domains = projectsWithDomains.map(p => `domain=${p.domain}`).join('&')
  const { data: projectData } = await api.get(`/v1/projects/by/domain?${domains}`)
  const projectsWithData = projectsWithDomains.map(async ({ title, img, domain, description }) => {
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

async function getFeaturedEmbed () {
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

async function getHomeData() {
  return allByKeys({
    cultureZine: getCultureZine(),
    curatedCollections: getFeaturedCollections(),
    appsWeLove: getFeaturedProjects(),
    featuredEmbed: getFeaturedEmbed(),
    unifiedStories: getUnifiedStories(),
    featureCallouts: getFeatureCallouts(),
    buildingOnGlitch: getBuildingOnGlitch(),
  })
}

module.exports = { getHomeData }