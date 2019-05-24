// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { partition } from 'lodash';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import TextInput from 'Components/inputs/text-input';
import Link from 'Components/link';
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
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAlgoliaSearch } from 'State/search';
import { useCurrentUser } from 'State/current-user';

import useDebouncedValue from '../../hooks/use-debounced-value';
import { AddProjectToCollectionMsg, useNotifications } from '../../presenters/notifications';
import ProjectAvatar from '../../presenters/includes/project-avatar';

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
    <div className={styles.popoverTitleWrap}>
      <ProjectAvatar {...project} /> Add {project.domain} to collection
    </div>
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

const AlreadyInCollection = ({ project, collections }) => (
  <PopoverInfo>
    <strong>{project.domain}</strong> is already in <Pluralize count={collections.length} showCount={false} singular="collection" />{' '}
    {collections
      .slice(0, 3)
      .map((collection) => (
        <Link key={collection.id} to={`/@${collection.fullUrl}`}>
          {collection.name}
        </Link>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])}
    {collections.length > 3 && (
      <>
        , and{' '}
        <div className={styles.moreCollectionsBadge}>
          <Badge>{collections.length - 3}</Badge>
        </div>{' '}
        <Pluralize count={collections.length - 3} singular="other" showCount={false} />
      </>
    )}
  </PopoverInfo>
);

function useCollectionSearch(query, project, collectionType) {
  const { currentUser } = useCurrentUser();
  const debouncedQuery = useDebouncedValue(query, 200);
  const filters = collectionType === 'user' ? { userIDs: [currentUser.id] } : { teamIDs: currentUser.teams.map((team) => team.id) };

  const searchResults = useAlgoliaSearch(debouncedQuery, { ...filters, filterTypes: ['collection'], allowEmptyQuery: true }, [collectionType]);

  const [collectionsWithProject, collections] = useMemo(
    () => partition(searchResults.collection, (result) => result.projects.includes(project.id)).map((list) => list.slice(0, 20)),
    [searchResults.collection, project.id, collectionType],
  );

  return { collections, collectionsWithProject };
}

export const AddProjectToCollectionBase = ({ project, fromProject, addProjectToCollection, togglePopover, createCollectionPopover }) => {
  const [collectionType, setCollectionType] = useState('user');
  const [query, setQuery] = useState('');
  const { collections, collectionsWithProject } = useCollectionSearch(query, project, collectionType);
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();

  const addProjectTo = (collection) => {
    addProjectToCollection(project, collection).then(() => {
      createNotification(
        <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />,
        'notifySuccess',
      );
    });

    togglePopover();
  };

  const { activeIndex, onKeyDown } = useActiveIndex(collections, addProjectTo);

  return (
    <PopoverDialog wide align="right">
      {/* Only show this nested popover title from project-options */}
      {fromProject && <AddProjectPopoverTitle project={project} />}

      {currentUser.teams.length > 0 && (
        <PopoverActions>
          <SegmentedButtons value={collectionType} buttons={collectionTypeOptions} onChange={setCollectionType} />
        </PopoverActions>
      )}

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

      {collections.length > 0 && (
        <PopoverSection>
          <ResultsList items={collections} scroll>
            {(collection, i) => (
              <ScrollResult active={activeIndex === i}>
                <AddProjectToCollectionResultItem active={activeIndex === i} onClick={() => addProjectTo(collection)} collection={collection} />
              </ScrollResult>
            )}
          </ResultsList>
        </PopoverSection>
      )}

      {collectionsWithProject.length > 0 && <AlreadyInCollection project={project} collections={collectionsWithProject} />}

      {collections.length === 0 && collectionsWithProject.length === 0 && query.length > 0 && (
        <PopoverInfo>
          <NoSearchResultsPlaceholder />
        </PopoverInfo>
      )}

      {collections.length === 0 && collectionsWithProject.length === 0 && query.length === 0 && (
        <PopoverInfo>
          <NoCollectionPlaceholder />
        </PopoverInfo>
      )}

      <PopoverActions>
        <Button size="small" type="tertiary" onClick={createCollectionPopover}>
          Add to a new collection
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
};

AddProjectToCollectionBase.propTypes = {
  fromProject: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  createCollectionPopover: PropTypes.func.isRequired,
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
      <MultiPopover
        views={{
          createCollectionPopover: () => (
            <CreateCollectionWithProject
              addProjectToCollection={(...args) => {
                addProjectToCollection(...args);
                togglePopover();
              }}
              project={project}
            />
          ),
        }}
      >
        {({ createCollectionPopover }) => (
          <AddProjectToCollectionBase
            addProjectToCollection={addProjectToCollection}
            fromProject={false}
            project={project}
            togglePopover={togglePopover}
            createCollectionPopover={createCollectionPopover}
          />
        )}
      </MultiPopover>
    )}
  </PopoverWithButton>
);

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
