import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { kebabCase } from 'lodash';

import { getLink, getOwnerLink } from 'Models/collection';
import Button from 'Components/buttons/button';
import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import CollectionContainer from 'Components/collection/container';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';

import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCollectionEditor, userOrTeamIsAuthor } from 'State/collection';
import { getSingleItem, getAllPages } from 'Shared/api';

const CollectionPageContents = withRouter(({ history, collection: initialCollection }) => {
  const { currentUser } = useCurrentUser();
  const [collection, baseFuncs] = useCollectionEditor(initialCollection);
  const currentUserIsAuthor = userOrTeamIsAuthor({ collection, user: currentUser });

  const funcs = {
    ...baseFuncs,
    onDeleteCollection: () => {
      if (!window.confirm('Are you sure you want to delete your collection?')) return;
      baseFuncs.deleteCollection();
      history.push(getOwnerLink(collection));
    },
    onNameChange: async (name) => {
      const url = kebabCase(name);
      const result = await funcs.updateNameAndUrl({ name, url });
      history.replace(getLink({ ...collection, url }));
      return result;
    },
  };

  return (
    <>
      <Helmet title={collection.name} />
      <main>
        <CollectionContainer collection={collection} showFeaturedProject isAuthorized={currentUserIsAuthor} funcs={funcs} />
        {!currentUserIsAuthor && <ReportButton reportedType="collection" reportedModel={collection} />}
        {currentUserIsAuthor && (
          <Button type="dangerZone" size="small" emoji="bomb" onClick={funcs.onDeleteCollection}>
            Delete Collection
          </Button>
        )}
      </main>
      <MoreCollectionsContainer collection={collection} />
    </>
  );
});

CollectionPageContents.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
  }).isRequired,
};

async function loadCollection(api, ownerName, collectionName) {
  try {
    const collection = await getSingleItem(
      api,
      `v1/collections/by/fullUrl?fullUrl=${encodeURIComponent(ownerName)}/${collectionName}`,
      `${ownerName}/${collectionName}`,
    );
    collection.projects = await getAllPages(
      api,
      `v1/collections/by/id/projects?id=${collection.id}&orderKey=projectOrder&orderDirection=ASC&limit=100`,
    );

    if (collection.user) {
      collection.user = await getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id);
    } else {
      collection.team = await getSingleItem(api, `v1/teams/by/id?id=${collection.team.id}`, collection.team.id);
    }

    return collection;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

const CollectionPage = ({ ownerName, name }) => (
  <Layout>
    <DataLoader get={(api) => loadCollection(api, ownerName, name)}>
      {(collection) =>
        collection ? (
          <AnalyticsContext
            properties={{ origin: 'collection' }}
            context={{
              groupId: collection.team ? collection.team.id.toString() : '0',
            }}
          >
            <CollectionPageContents collection={collection} />
          </AnalyticsContext>
        ) : (
          <NotFound name={name} />
        )
      }
    </DataLoader>
  </Layout>
);

export default CollectionPage;
