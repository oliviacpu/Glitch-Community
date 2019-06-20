import React from 'react';

import Helmet from 'react-helmet';
import MoreIdeas from 'Components/more-ideas';
import Questions from 'Components/questions';
import Layout from 'Components/layout';

const QuestionsPage = () => (
  <Layout>
    <Helmet title="Questions" />
    <main>
      <Questions max={12} />
      <MoreIdeas />
    </main>
  </Layout>
);

export default QuestionsPage;
