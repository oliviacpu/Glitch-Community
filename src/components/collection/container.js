import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { partition } from 'lodash';
import classnames from 'classnames';

import { isDarkColor, getLink, getOwnerLink } from 'Models/collection';
import Button from 'Components/buttons/button';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import FeaturedProject from 'Components/project/featured-project';
import NotFound from 'Components/errors/not-found';
import { ProfileItem } from 'Components/profile-list';
import ProjectsList from 'Components/containers/projects-list';
import CollectionNameInput from 'Components/fields/collection-name-input';
import DataLoader from 'Components/data-loader';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';
import AddCollectionProject from 'Components/collection/add-collection-project-pop';
import EditCollectionColor from 'Components/collection/edit-collection-color-pop';
import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import AuthDescription from 'Components/fields/auth-description';
import { CollectionAvatar } from 'Components/images/avatar';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCollectionEditor, userOrTeamIsAuthor } from 'State/collection';
import { getSingleItem, getAllPages } from 'Shared/api';

import styles from './container.styl';

const CollectionContainer = ({ collection, showFeaturedProject, isAuthorized, funcs }) => {
  const collectionHasProjects = collection.projects.length > 0;
  let featuredProject = null;
  let { projects } = collection;
  if (showFeaturedProject && collection.featuredProjectId) {
    [[featuredProject], projects] = partition(collection.projects, (p) => p.id === collection.featuredProjectId);
  }
  const enableSorting = isAuthorized && projects.length > 1;
  
  return (
    <article className={classnames(styles.container, isDarkColor(collection.coverColor) && styles.dark)}>
      <header className={styles.collectionHeader} style={{ backgroundColor: collection.coverColor }}>
        <div className={styles.imageContainer}>
          <CollectionAvatar collection={collection} />
        </div>

        <div className={styles.collectionInfo}>
          <h1 className={styles.name}>
            {isAuthorized ? <CollectionNameInput name={collection.name} onChange={funcs.onNameChange} /> : collection.name}
          </h1>

          <div className={styles.owner}>
            <ProfileItem hasLink team={collection.team} user={collection.user} />
          </div>

          <div className={styles.description}>
            <AuthDescription
              authorized={isAuthorized}
              description={collection.description}
              update={funcs.updateDescription}
              placeholder="Tell us about your collection"
            />
          </div>

          <div className={styles.projectCount}>
            <Text>
              <Pluralize count={collection.projects.length} singular="Project" />
            </Text>
          </div>

          {isAuthorized && funcs.updateColor && <EditCollectionColor update={funcs.updateColor} initialColor={collection.coverColor} />}
        </div>
      </header>

      <div className={styles.collectionContents}>
        <div className={styles.collectionProjectContainerHeader}>
          {isAuthorized && funcs.addProjectToCollection && <AddCollectionProject addProjectToCollection={funcs.addProjectToCollection} collection={collection} />}
        </div>
        {!collectionHasProjects && isAuthorized && (
          <div className={styles.emptyCollectionHint}>
            <Image
              src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934"
              alt="psst"
              width=""
              height=""
            />
            <Text>You can add any project, created by any user</Text>
          </div>
        )}
        {!collectionHasProjects && !isAuthorized && (
          <div className={styles.emptyCollectionHint}>No projects to see in this collection just yet.</div>
        )}
        {featuredProject && (
          <FeaturedProject
            isAuthorized={isAuthorized}
            featuredProject={featuredProject}
            unfeatureProject={funcs.unfeatureProject}
            addProjectToCollection={funcs.addProjectToCollection}
            collection={collection}
            displayNewNote={funcs.displayNewNote}
            updateNote={funcs.updateNote}
            hideNote={funcs.hideNote}
          />
        )}
        {collectionHasProjects && (
          <ProjectsList
            layout="gridCompact"
            projects={projects}
            collection={collection}
            enableSorting={enableSorting}
            onReorder={funcs.updateProjectOrder}
            noteOptions={{
              hideNote: funcs.hideNote,
              updateNote: funcs.updateNote,
              isAuthorized: isAuthorized,
            }}
            projectOptions={{
              removeProjectFromCollection: funcs.removeProjectFromCollection,
              addProjectToCollection: funcs.addProjectToCollection,
              displayNewNote: funcs.displayNewNote,
              featureProject: funcs.featureProject,
              isAuthorized: isAuthorized,
            }}
          />
        )}
        {enableSorting && (
          <div>Drag to reorder, or move focus to a project and press space. Move it with the arrow keys and press space again to save.</div>
        )}
      </div>
    </article>
  )
}

CollectionContainer.propTypes = {
  collection: PropTypes.shape({
    projects: PropTypes.array.isRequired,
    coverColor: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    featuredProjectId: PropTypes.string,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
  showFeaturedProject: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  funcs: PropTypes.object,
}
CollectionContainer.defaultProps = {
  showFeaturedProject: false,
  isAuthorized: false,
  funcs: {},
}
  
  
export default CollectionContainer;
