import { configure, addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { MemoryRouter } from 'react-router-dom';

const enableLinks = (story) => <MemoryRouter>{story()}</MemoryRouter>;

addParameters({
  options: {
    showPanel: false,
  }
});

addDecorator(
  enableLinks, // make sure this comes first, otherwise some stories break.
  withInfo({
    header: false, // Global configuration for the info addon across all of your stories.
  }),
);

function loadStories() {
  require('../stories/index.js');
  require('../stories/inputs.js');

  // You can require as many stories as you need.
}

configure(loadStories, module);
