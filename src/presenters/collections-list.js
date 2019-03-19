import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';
import { TrackClick } from './analytics';
import CollectionItem from './collection-item';
import { getLink, createCollection } from '../models/collection';
import { Loader } from './includes/loader';
import { NotificationConsumer } from './notifications';

import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';
import Heading from '../components/text/heading';

class CollectionsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deletedCollectionIds: [],
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }

  async deleteCollection(id) {
    this.setState(({ deletedCollectionIds }) => ({
      deletedCollectionIds: [...deletedCollectionIds, id],
    }));
    await this.props.api.delete(`/collections/${id}`);
  }

  render() {
    const { title, api, isAuthorized, maybeCurrentUser, maybeTeam } = this.props;
    const { deleteCollection } = this;
    const collections = this.props.collections.filter(({ id }) => !this.state.deletedCollectionIds.includes(id));
    const hasCollections = !!collections.length;
    const canMakeCollections = isAuthorized && !!maybeCurrentUser;

    if (!hasCollections && !canMakeCollections) {
      return null;
    }
    return (
      <article className="collections">
        <Heading tagName="h2">{title}</Heading>
        {canMakeCollections && (
          <>
            <CreateCollectionButton {...{ api, currentUser: maybeCurrentUser, maybeTeam }} />
            {!hasCollections && <CreateFirstCollection {...{ api, currentUser: maybeCurrentUser }} />}
          </>
        )}
        <CollectionsUL
          {...{
            collections,
            api,
            isAuthorized,
            deleteCollection,
          }}
        />
      </article>
    );
  }
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

CollectionsList.defaultProps = {
  maybeCurrentUser: undefined,
  maybeTeam: undefined,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className="placeholder">Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

export class CreateCollectionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
      loading: false,
      newCollectionUrl: '',
    };
    this.createCollectionOnClick = this.createCollectionOnClick.bind(this);
  }

  async createCollectionOnClick(createNotification) {
    this.setState({ loading: true });

    const collectionResponse = await createCollection(
      this.props.api,
      null,
      this.props.maybeTeam ? this.props.maybeTeam.id : null,
      createNotification,
    );
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      if (this.props.maybeTeam) {
        collection.team = this.props.maybeTeam;
      } else {
        collection.user = this.props.currentUser;
      }
      const newCollectionUrl = getLink(collection);
      this.setState({ newCollectionUrl, shouldRedirect: true });
    } else {
      // error messaging handled in createCollection
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to={this.state.newCollectionUrl} push />;
    }
    if (this.state.loading) {
      return (
        <div id="create-collection-container">
          <Loader />
        </div>
      );
    }
    return (
      <NotificationConsumer>
        {({ createNotification }) => (
          <div id="create-collection-container">
            <TrackClick name="Create Collection clicked">
              <button className="button" id="create-collection" onClick={() => this.createCollectionOnClick(createNotification)}>
                Create Collection
              </button>
            </TrackClick>
          </div>
        )}
      </NotificationConsumer>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
};

export const CollectionsUL = ({ collections, deleteCollection, api, isAuthorized }) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}

      {orderedCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          {...{
            collection,
            api,
            isAuthorized,
            deleteCollection,
          }}
        />
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionsUL.defaultProps = {
  deleteCollection: () => {},
};

export default function CollectionsListWrapper(props) {
  const api = useAPI();
  const currentUser = useCurrentUser();
  return <CollectionsList {...props} api={api} maybeCurrentUser={currentUser} />;
}
