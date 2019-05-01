import React from 'react';
import { storiesOf } from '@storybook/react';

import NewStuffArticle from './new-stuff-article';

const story = storiesOf('New Stuff', module);

story.add('Article', () => (
  <NewStuffArticle title="Article Title" body="Lorem ipsum is a _placeholder text_ commonly used to demonstrate the visual form of a document without relying on meaningful content" />
));

story.add('Article with link', () => (
  <NewStuffArticle title="Article Title" body={'check out that link\n# 👇 👇 👇'} link="#" />
));

story.add('Articles', () => (
  <>
    <NewStuffArticle title="Article Title 1" body={'markdown _body_ __here__'} link="#" />
    <NewStuffArticle title="Article Title 2" body={'markdown _body_ here\nall over again'} />
    <NewStuffArticle title="Article Title 3" body={'- hello\n- i am a list\n- an unordered list'} />
  </>
));
