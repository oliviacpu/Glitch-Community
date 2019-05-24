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
import ResultsList, { ScrollResult, useActiveIndex } from 'Components/containers/results-list';
import CollectionResultItem from 'Components/collection/collection-result-item';
import { getAvatarUrl } from 'Models/project';
import { getLink as getCollectionLink } from 'Models/collection';
import { getAllPages } from 'Shared/api';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useAlgoliaSearch } from 'State/search';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { AddProjectToCollectionMsg, useNotifications } from '../../presenters/notifications';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import useDebouncedValue from '../../hooks/use-debounced-value';

// import CreateCollectionPop from './create-collection-pop';
import styles from './popover.styl';

const collectionTypeOptions = [
  {
    name: 'user',
    contents: 'Your collections',
  },
  {
    name: 'team',
    contents: 'Team collections',
  },
];

const NoSearchResultsPlaceholder = () => <InfoDescription>No matching collections found – add to a new one?</InfoDescription>;

const NoCollectionPlaceholder = () => <InfoDescription>Create collections to organize your favorite projects.</InfoDescription>;

const AddProjectPopoverTitle = ({ project }) => (
  <MultiPopoverTitle>
    <ProjectAvatar {...project} /> Add {project.domain} to collection
  </MultiPopoverTitle>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, collection, active }) => {
  const onClickTracked = useTrackedFunc(
    onClick,
    'Project Added to Collection',
    {},
    {
      groupId: collection.team ? collection.team.id : 0,
    },
  );
  return <CollectionResultItem onClick={onClickTracked} collection={collection} active={active} />;
};

const AddProjectToCollectionResults = ({ addProjectToCollection, collections, query, activeIndex }) => {
  if (collections.length) {
    return (
      <PopoverSection>
        <ResultsList items={collections} scroll>
          {(collection, i) => (
            <ScrollResult active={activeIndex === i}>
              <AddProjectToCollectionResultItem
                active={activeIndex === i}
                onClick={() => addProjectToCollection(collection)}
                collection={collection}
              />
            </ScrollResult>
          )}
        </ResultsList>
      </PopoverSection>
    );
  }

  if (query) {
    return (
      <PopoverInfo>
        <NoSearchResultsPlaceholder />
      </PopoverInfo>
    );
  }

  return (
    <PopoverInfo>
      <NoCollectionPlaceholder />
    </PopoverInfo>
  );
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
        <Pluralize count={collectionsWithProject.length - 3} singular="other" showCount={false} />
      </>
    )}
  </PopoverInfo>
);

function useCollectionSearch(query, project, collectionType) {
  const { currentUser } = useCurrentUser();
  const filters = collectionType == 'user' ? { userIDs: [currentUser.id] } : { teamIDs: currentUser.teams.map((team) => team.id) };

  const searchResults = useAlgoliaSearch(query, filters);

  const [collectionsWithProject, collections] = useMemo(
    () => partition(searchResults.collection, (result) => result.projects.includes(project.id)).map((list) => list.slice(0, 20)),
    [searchResults.collection, project.id],
  );
  
  return { collections, collectionsWithProject }
}

export const AddProjectToCollectionBase = ({ project, fromProject, addProjectToCollection, togglePopover }) => {
  const [collectionType, setCollectionType] = useState('user');
  const [query, setQuery] = useState('');
  const { collections, collectionsWithProject } = useCollectionSearch(query, project, collectionType);
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

  const debouncedQuery = useDebouncedValue(query.toLowerCase().trim(), 300);
  const filteredCollections = useMemo(
    () => (collections || []).filter((collection) => collection.name.toLowerCase().includes(debouncedQuery)).slice(0, 20),
    [debouncedQuery, collections],
  );
  const { activeIndex, onKeyDown } = useActiveIndex(filteredCollections, addProject);

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
              <SegmentedButtons value={collectionType} buttons={collectionTypeOptions} onChange={setCollectionType} />
            </PopoverActions>
          )}

          {collections && collections.length > 0 && (
            <PopoverInfo>
              <TextInput
                autoFocus
                value={query}
                onChange={setQuery}
                onKeyDown={onKeyDown}
                placeholder="Filter collections"
                labelText="Filter collections"
                opaque
                type="search"
              />
            </PopoverInfo>
          )}

          {collections ? (
            <AddProjectToCollectionResults
              addProjectToCollection={addProject}
              collections={filteredCollections}
              query={query}
              activeIndex={activeIndex}
            />
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
