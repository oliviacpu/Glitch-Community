import React from 'react';

import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import categories from '../../curated/categories';

import { Link } from './includes/link';
import styles from './more-ideas.styl';

export const MoreIdeas = () => (
  <section className={styles.container}>
    <Heading tagName="h2">More Ideas</Heading>
    <ul className={styles.grid}>
      {categories.map((category) => (
        <li className={styles.gridItem} key={category.id}>
          <Link className={styles.link} to={category.url} style={{ backgroundColor: category.color }}>
            <Image src={category.avatarUrl} alt="" />
            <div>{category.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MoreIdeas;
