import React from 'react';

import Helmet from 'react-helmet';
import MoreIdeas from 'Components/more-ideas';
import Layout from '../layout';
import Questions from '../questions';

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
