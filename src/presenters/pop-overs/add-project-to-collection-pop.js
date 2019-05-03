// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import { flatten, orderBy } from 'lodash';
import Loader from 'Components/loader';
import { getAllPages } from 'Shared/api';
import { captureException } from '../../utils/sentry';

import { useTrackedFunc } from '../segment-analytics';
import { getAvatarUrl } from '../../models/project';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

import CreateCollectionPop from './create-collection-pop';
import CollectionResultItem from '../includes/collection-result-item';

import { NestedPopover, NestedPopoverTitle } from './popover-nested';

const NoSearchResultsPlaceholder = () => <p className="info-description">No matching collections found – add to a new one?</p>;

const NoCollectionPlaceholder = () => <p className="info-description">Create collections to organize your favorite projects.</p>;

const AddProjectPopoverTitle = ({ project }) => (
  <NestedPopoverTitle>
    <img src={getAvatarUrl(project.id)} alt="" /> Add {project.domain} to collection
  </NestedPopoverTitle>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, collection, ...props }) => {
  const onClickTracked = useTrackedFunc(onClick, 'Project Added to Collection', {}, {
    groupId: collection.team ? collection.team.id : 0,
  });
  return (
    <CollectionResultItem
      onClick={onClickTracked}
      collection={collection}
      {...props}
    />
  );
};

class AddProjectToCollectionPopContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '', // value of filter input field
      filteredCollections: this.props.collections, // collections filtered from search query
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.renderCollection = this.renderCollection.bind(this);
  }

  updateFilter(query) {
    query = query.toLowerCase().trim();
    const filteredCollections = this.props.collections.filter((collection) => collection.name.toLowerCase().includes(query));
    this.setState({ filteredCollections, query });
  }

  // filter out collections that already contain the selected project
  renderCollection(collection) {
    return (
      <li key={collection.id}>
        <AddProjectToCollectionResultItem
          onClick={this.props.addProjectToCollection}
          project={this.props.project}
          collection={collection}
          togglePopover={this.props.togglePopover}
          currentUser={this.props.currentUser}
        />
      </li>
    );
  }

  render() {
    const { filteredCollections, query } = this.state;
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {/* Only show this nested popover title from project-options */}
        {!this.props.fromProject && <AddProjectPopoverTitle project={this.props.project} />}

        {this.props.collections.length > 3 && (
          <section className="pop-over-info">
            <input
              className="pop-over-input search-input pop-over-search"
              onChange={(evt) => {
                this.updateFilter(evt.target.value);
              }}
              placeholder="Filter collections"
              aria-label="Filter collections"
            />
          </section>
        )}

        {filteredCollections.length ? (
          <section className="pop-over-actions results-list">
            <ul className="results">{filteredCollections.map(this.renderCollection)}</ul>
          </section>
        ) : (
          <section className="pop-over-info">{query ? <NoSearchResultsPlaceholder /> : <NoCollectionPlaceholder />}</section>
        )}

        <section className="pop-over-actions">
          <button className="create-new-collection button-small button-tertiary" onClick={this.props.createCollectionPopover}>
            Add to a new collection
          </button>
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPopContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  collections: PropTypes.array,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func, // required but added dynamically
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

AddProjectToCollectionPopContents.defaultProps = {
  addProjectToCollection: null,
  collections: [],
  currentUser: null,
  togglePopover: null,
  fromProject: false,
};

const AddProjectToCollectionPop = (props) => {
  const { fromProject, project, togglePopover } = props;

  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const [maybeCollections, setMaybeCollections] = React.useState(null);

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
    try {
      const requests = [
        getAllPages(api, `v1/projects/by/id/collections?id=${project.id}&${orderParams}`),
        loadUserCollections(currentUser),
        ...currentUser.teams.map((team) => loadTeamCollections(team)),
      ];
      const [projectCollections, ...collectionArrays] = await Promise.all(requests);

      const alreadyInCollectionIds = new Set(projectCollections.map((c) => c.id));
      const collections = flatten(collectionArrays).filter((c) => !alreadyInCollectionIds.has(c.id));

      const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

      setMaybeCollections(orderedCollections);
    } catch (error) {
      captureException(error);
    }
  };

  React.useEffect(() => {
    loadCollections();
  }, [currentUser.id]);

  return (
    <NestedPopover
      alternateContent={() => (
        <CreateCollectionPop {...props} collections={maybeCollections} togglePopover={togglePopover} />
      )}
      startAlternateVisible={false}
    >
      {(createCollectionPopover) => {
        if (!maybeCollections) {
          return (
            <dialog className="pop-over add-project-to-collection-pop wide-pop">
              {!fromProject && <AddProjectPopoverTitle project={project} />}
              <div className="loader-container">
                <Loader />
              </div>
            </dialog>
          );
        }
        return (
          <AddProjectToCollectionPopContents {...props} collections={maybeCollections} createCollectionPopover={createCollectionPopover} />
        );
      }}
    </NestedPopover>
  );
};

AddProjectToCollectionPop.propTypes = {
  fromProject: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func,
};

AddProjectToCollectionPop.defaultProps = {
  fromProject: false,
  togglePopover: null,
};

export default AddProjectToCollectionPop;
