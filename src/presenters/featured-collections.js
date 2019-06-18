import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { sampleSize, flatMap, uniq } from 'lodash';
import Markdown from 'Components/text/markdown';
import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import { ProfileItem } from 'Components/profile-list';
import { CollectionLink } from 'Components/link';
import DataLoader from 'Components/data-loader';
import { CollectionAvatar } from 'Components/images/avatar';
import { captureException } from '../utils/sentry';

import { featuredCollections } from '../curated/collections';
import { isDarkColor } from '../models/collection';

import { getSingleItem, getFromApi, joinIdsToQueryString } from '../../shared/api';


const CollectionWide = ({ collection }) => {
  const dark = isDarkColor(collection.coverColor) ? 'dark' : '';
  const featuredProjects = sampleSize(collection.projects, 3);
  const featuredProjectsHaveAtLeastOneNote = featuredProjects.filter((p) => !!p.note).length > 0;
  return (
    <article className="collection-wide projects" style={{ backgroundColor: collection.coverColor }}>
      <header className={`collection ${dark}`}>
        <CollectionLink className="collection-image-container" collection={collection}>
          <CollectionAvatar collection={collection} />
        </CollectionLink>
        <CollectionLink className="collection-name" collection={collection}>
          <Heading tagName="h2">{collection.name}</Heading>
        </CollectionLink>
        <div className="collection-owner">
          <ProfileItem hasLinks team={collection.team} user={collection.user} />
        </div>
        <div className="collection-description">
          <Markdown length={80}>{collection.description}</Markdown>
        </div>
      </header>
      <div className="collection-contents">
        <ProjectsList
          layout="row"
          projects={featuredProjects}
          collection={collection}
          hideProjectDescriptions={featuredProjectsHaveAtLeastOneNote}
          noteOptions={{ isAuthorized: false }}
        />
        <CollectionLink collection={collection} className="collection-view-all">
          View all <Pluralize count={collection.projectCount} singular="project" /> <span aria-hidden>→</span>
        </CollectionLink>
      </div>
    </article>
  );
};

CollectionWide.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const loadCollection = async (api, { owner, name }) => {
  try {
    const collection = await getSingleItem(api, `/v1/collections/by/fullUrl?fullUrl=${encodeURIComponent(owner)}/${name}`, `${owner}/${name}`);
    collection.projects = await getSingleItem(api, `/v1/collections/by/fullUrl/projects?limit=20&fullUrl=${encodeURIComponent(owner)}/${name}`, 'items');
    collection.team = await getSingleItem(api, `/v1/teams/by/id?id=${collection.team.id}`, collection.team.id);
    collection.projectCount = collection.projects.length;
    collection.projects = sampleSize(collection.projects, 3);
    
    return collection;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    captureException(error);
  }

  return null;
};

const loadAllCollections = async (api, infos) => {
  // don't await until every request is sent so they can all run at once
  const promises = infos.map((info) => loadCollection(api, info));
  return Promise.all(promises);
};

export const FeaturedCollections = () => (
  <DataLoader get={(api) => loadAllCollections(api, featuredCollections)}>
    {(collections) => collections.filter((c) => !!c).map((collection) => <CollectionWide collection={collection} key={collection.id} />)}
  </DataLoader>
);

export default FeaturedCollections;
