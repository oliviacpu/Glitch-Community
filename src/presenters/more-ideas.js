import React from 'react';

import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import categories from '../curated/categories';
import { moreIdeasTeam } from '../curated/collections';
import { isDarkColor } from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import { CollectionLink, Link } from './includes/link';
import { DataLoader } from './includes/loader';

import { useAPI } from '../state/api';

export const MoreIdeasCategories = () => (
  <section className="more-ideas">
    <Heading tagName="h2">More Ideas</Heading>
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link className="more-ideas-box" to={category.url} style={{ backgroundColor: category.color }}>
            <Image src={category.avatarUrl} alt="" />
            <div>{category.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MoreIdeasCategories;
