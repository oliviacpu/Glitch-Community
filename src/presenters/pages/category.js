import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Image from 'Components/images/image';
import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import MoreIdeas from 'Components/more-ideas';
import DataLoader from 'Components/data-loader';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCollectionEditor } from 'State/collection';

import Layout from '../layout';
import ProjectsLoader from '../projects-loader';

const CategoryPageWrap = ({ category: initialCategory }) => {
  const { currentUser } = useCurrentUser();
  const [category, { addProjectToCollection }] = useCollectionEditor(initialCategory);
  return (
    <>
      <Helmet title={category.name} />
      <main className="collection-page">
        <article className="projects collection-full" style={{ backgroundColor: category.backgroundColor }}>
          <header className="collection">
            <Heading tagName="h1">{category.name}</Heading>
            <div className="collection-image-container">
              <Image src={category.avatarUrl} alt="" />
            </div>

            <p className="description">{category.description}</p>
          </header>

          <ProjectsLoader projects={category.projects}>
            {(projects) => (
              <div className="collection-contents">
                <div className="collection-project-container-header">
                  <Heading tagName="h3">Projects ({category.projects.length})</Heading>
                </div>

                {currentUser.login ? (
                  <ProjectsList
                    layout="gridCompact"
                    projects={projects}
                    projectOptions={{
                      addProjectToCollection,
                    }}
                  />
                ) : (
                  <ProjectsList layout="gridCompact" projects={projects} />
                )}
              </div>
            )}
          </ProjectsLoader>
        </article>
      </main>
      <MoreIdeas />
    </>
  );
};
CategoryPageWrap.propTypes = {
  category: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
  }).isRequired,
};

async function loadCategory(api, id) {
  const { data } = await api.get(`categories/${id}`);
  return data;
}

const CategoryPage = ({ category }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'category' }}>
      <DataLoader get={(api) => loadCategory(api, category.id)}>
        {(category) => <CategoryPageWrap category={category} userIsAuthor={false} />}
      </DataLoader>
    </AnalyticsContext>
  </Layout>
);
CategoryPage.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryPage;
