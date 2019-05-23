// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { flatten, orderBy, partition } from 'lodash';
import Loader from 'Components/loader';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import TextInput from 'Components/inputs/text-input';
import { CollectionLink } from 'Components/link';
import {
  PopoverWithButton,
  MultiPopover,
  MultiPopoverTitle,
  PopoverDialog,
  InfoDescription,
  PopoverInfo,
  PopoverActions,
  PopoverSection,
} from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import ResultsList from 'Components/containers/results-list';
import { getAvatarUrl } from 'Models/project';
import { getLink as getCollectionLink } from 'Models/collection';
import { getAllPages } from 'Shared/api';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { AddProjectToCollectionMsg, useNotifications } from '../../presenters/includes/notifications';
import useDebouncedValue from '../../hooks/use-debounced-value';

// import CreateCollectionPop from './create-collection-pop';
import CollectionResultItem from '../../presenters/includes/collection-result-item';
import styles from './popover.styl';

const filterTypes = ['Your collections', 'Team collections'];
const segmentedButtonOptions = filterTypes.map((name) => ({
  name,
  contents: name,
}));

const NoSearchResultsPlaceholder = () => <InfoDescription>No matching collections found – add to a new one?</InfoDescription>;

const NoCollectionPlaceholder = () => <InfoDescription>Create collections to organize your favorite projects.</InfoDescription>;

const AddProjectPopoverTitle = ({ project }) => (
  <MultiPopoverTitle>
    <img src={getAvatarUrl(project.id)} alt="" /> Add {project.domain} to collection
  </MultiPopoverTitle>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, project, collection }) => {
  const onClickTracked = useTrackedFunc(
    onClick,
    'Project Added to Collection',
    {},
    {
      groupId: collection.team ? collection.team.id : 0,
    },
  );
  return <CollectionResultItem onClick={onClickTracked} project={project} collection={collection} />;
};

const AddProjectToCollectionResults = ({ addProjectToCollection, collections, project, query }) => {
  const debouncedQuery = useDebouncedValue(query.toLowerCase().trim(), 300);
  const filteredCollections = useMemo(() => collections.filter((collection) => collection.name.toLowerCase().includes(debouncedQuery)), [
    debouncedQuery,
    collections,
  ]);
  return (
    <>
      {filteredCollections.length ? (
        <PopoverSection>
          <ResultsList items={filteredCollections} scroll>
            {(collection) => (
              <AddProjectToCollectionResultItem onClick={() => addProjectToCollection(collection)} project={project} collection={collection} />
            )}
          </ResultsList>
        </PopoverSection>
      ) : (
        <PopoverInfo>{query ? <NoSearchResultsPlaceholder /> : <NoCollectionPlaceholder />}</PopoverInfo>
      )}
    </>
  );
};

AddProjectToCollectionResults.propTypes = {
  addProjectToCollection: PropTypes.func,
  collections: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  query: PropTypes.string,
};

AddProjectToCollectionResults.defaultProps = {
  addProjectToCollection: null,
  query: '',
};

const AlreadyInCollection = ({ project, collectionsWithProject }) => (
  <PopoverInfo>
    <strong>{project.domain}</strong> is already in <Pluralize count={collectionsWithProject.length} showCount={false} singular="collection" />{' '}
    {collectionsWithProject
      .slice(0, 3)
      .map((collection) => (
        <CollectionLink key={collection.id} collection={collection}>
          {collection.name}
        </CollectionLink>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])}
    {collectionsWithProject.length > 3 && (
      <>
        , and{' '}
        <div className={styles.moreCollectionsBadge}>
          <Badge>{collectionsWithProject.length - 3}</Badge>
        </div>{' '}
        po <Pluralize count={collectionsWithProject.length - 3} singular="other" showCount={false} />
      </>
    )}
  </PopoverInfo>
);

function useCollectionSearch(project, collectionType) {
  const api = useAPI();
  const { currentUser } = useCurrentUser();

  const [maybeCollections, setMaybeCollections] = useState(null);
  const [collectionsWithProject, setCollectionsWithProject] = useState([]);

  useEffect(() => {
    let canceled = false;
    setMaybeCollections(null); // reset maybCollections on reload to show loader

    const orderParams = 'orderKey=url&orderDirection=ASC&limit=100';

    const loadUserCollections = async (user) => {
      const collections = await getAllPages(api, `v1/users/by/id/collections?id=${user.id}&${orderParams}`);
      return collections.map((collection) => ({ ...collection, user }));
    };

    const loadTeamCollections = async (team) => {
      const collections = await getAllPages(api, `v1/teams/by/id/collections?id=${team.id}&${orderParams}`);
      return collections.map((collection) => ({ ...collection, team }));
    };

    const loadCollections = async () => {
      const projectCollectionsRequest = getAllPages(api, `v1/projects/by/id/collections?id=${project.id}&${orderParams}`);
      const userCollectionsRequest = loadUserCollections(currentUser);

      const requests =
        collectionType === filterTypes[0]
          ? [projectCollectionsRequest, userCollectionsRequest]
          : [projectCollectionsRequest, ...currentUser.teams.map((team) => loadTeamCollections(team))];

      const [projectCollections, ...collectionArrays] = await Promise.all(requests);

      const alreadyInCollectionIds = new Set(projectCollections.map((c) => c.id));
      const [collections, _collectionsWithProject] = partition(flatten(collectionArrays), (c) => !alreadyInCollectionIds.has(c.id));

      const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

      if (!canceled) {
        setMaybeCollections(orderedCollections);
        setCollectionsWithProject(_collectionsWithProject);
      }
    };

    loadCollections().catch(captureException);
    return () => {
      canceled = true;
    };
  }, [project.id, currentUser.id, collectionType]);
  return { maybeCollections, collectionsWithProject };
}

export const AddProjectToCollectionBase = ({ project, fromProject, addProjectToCollection, togglePopover }) => {
  const [collectionType, setCollectionType] = useState(filterTypes[0]);
  const [query, setQuery] = useState('');
  const { maybeCollections: collections, collectionsWithProject } = useCollectionSearch(project, collectionType);
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();

  const addProject = (collection) => {
    addProjectToCollection(project, collection).then(() => {
      const content = (
        <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={getCollectionLink(collection)} />
      );
      createNotification(content, 'notifySuccess');
    });

    togglePopover();
  };

  return (
    <MultiPopover
      views={{
        createCollectionPopover: () => <div>TODO</div>,
      }}
    >
      {({ createCollectionPopover }) => (
        <PopoverDialog wide align="right">
          {/* Only show this nested popover title from project-options */}
          {fromProject && <AddProjectPopoverTitle project={project} />}

          {currentUser.teams.length > 0 && (
            <PopoverActions>
            <SegmentedButtons value={collectionType} buttons={segmentedButtonOptions} onChange={setCollectionType} />
          </PopoverActions>
          )}

          {collections && collections.length > 3 && (
            <PopoverInfo>
              <TextInput
                autoFocus
                value={query}
                onChange={setQuery}
                placeholder="Filter collections"
                labelText="Filter collections"
                opaque
                type="search"
              />
            </PopoverInfo>
          )}

          {collections ? (
            <AddProjectToCollectionResults addProjectToCollection={addProject} collections={collections} project={project} query={query} />
          ) : (
            <PopoverActions>
              <Loader />
            </PopoverActions>
          )}

          {collections && collectionsWithProject.length > 0 && (
            <AlreadyInCollection project={project} collectionsWithProject={collectionsWithProject} />
          )}

          <PopoverActions>
            <Button size="small" type="tertiary" onClick={createCollectionPopover}>
              Add to a new collection
            </Button>
          </PopoverActions>
        </PopoverDialog>
      )}
    </MultiPopover>
  );
};

AddProjectToCollectionBase.propTypes = {
  fromProject: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

const AddProjectToCollection = ({ project, addProjectToCollection }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small' }}
    buttonText={
      <>
        Add to Collection <Emoji name="framedPicture" />
      </>
    }
  >
    {({ togglePopover }) => (
      <AddProjectToCollectionBase
        addProjectToCollection={addProjectToCollection}
        fromProject={false}
        project={project}
        togglePopover={togglePopover}
      />
    )}
  </PopoverWithButton>
);

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
