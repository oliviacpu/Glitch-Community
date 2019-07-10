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
import { useCollectionEditor, userOrTeamIsAuthor, getCollectionWithProjects } from 'State/collection';

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


const CollectionPage = ({ owner, name }) => (
  <Layout>
    <DataLoader get={(api) => getCollectionWithProjects(api, { owner, name })}>
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
