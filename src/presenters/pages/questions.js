import React from 'react';

import Helmet from 'react-helmet';
import Layout from '../layout';

import Questions from '../questions';
import MoreIdeas from '../more-ideas';

const QuestionsPage = () => (
  <Layout>
    <Helmet>
      <title>Questions</title>
    </Helmet>
    <main className="questions-page">
      <Questions max={12} />
      <MoreIdeas />
    </main>
  </Layout>
);

export default QuestionsPage;
