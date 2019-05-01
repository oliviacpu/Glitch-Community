import React from 'react';
import { storiesOf } from '@storybook/react';

import NewStuffArticle from './new-stuff-article';

const story = storiesOf('New Stuff', module);

story.add('Article', () => (
  <NewStuffArticle title="Article Title" body="markdown _body_ here" />
));

story.add('Articles', () => (
  <>
    <NewStuffArticle title="Article Title 1" body="markdown _body_ here" />
    <NewStuffArticle title="Article Title 2" body="- hello\n- i am a list\n- an unordered list" />
  </>
));

story.add('Article with link', () => (
  <NewStuffArticle title="Article Title" body="check out that link\n#👇" link="#" />
));
