import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Image from 'Components/images/image';
import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import MoreIdeas from 'Components/more-ideas';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCollectionEditor } from 'State/collection';

import styles from './collection.styl';

const CategoryPageWrap = ({ category: initialCategory }) => {
  const { currentUser } = useCurrentUser();
  const [category, { addProjectToCollection }] = useCollectionEditor(initialCategory);
  return (
    <>
      <Helmet title={category.name} />
      <main>
        <article className={styles.container}>
          <header className={styles.collectionHeader} style={{ backgroundColor: category.backgroundColor }}>
            <Heading tagName="h1">{category.name}</Heading>
            <div className={styles.imageContainer}>
              <Image src={category.avatarUrl} alt="" />
            </div>

            <div className={styles.description}>
              <p>{category.description}</p>
            </div>
          </header>

          <div className={styles.collectionContents}>
            <div className={styles.collectionProjectContainerHeader}>
              <Heading tagName="h3">Projects ({category.projects.length})</Heading>
            </div>
            {currentUser.login ? (
              <ProjectsList
                layout="gridCompact"
                projects={category.projects}
                projectOptions={{
                  addProjectToCollection,
                }}
              />
            ) : (
              <ProjectsList layout="gridCompact" projects={category.projects} />
            )}
          </div>
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
  const { data: category } = await api.get(`categories/${id}`);
  return {
    ...category,
    projects: category.projects.map((project) => ({
      ...project,
      permissions: [],
      teamIds: [],
    })),
  };
}

const CategoryPage = ({ category }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'category' }}>
      <DataLoader get={(api) => loadCategory(api, category.id)}>{(loadedCategory) => <CategoryPageWrap category={loadedCategory} />}</DataLoader>
    </AnalyticsContext>
  </Layout>
);
CategoryPage.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryPage;
