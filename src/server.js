import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { GlobalsProvider } from 'State/globals';
import App from './app';

const Page = () => (
  <StaticRouter>
    <GlobalsProvider>
      <App />
    </GlobalsProvider>
  </StaticRouter>
);

export default Page;
