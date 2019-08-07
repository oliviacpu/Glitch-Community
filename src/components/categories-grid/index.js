import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { CDN_URL } from 'Utils/constants';

import styles from './create.styl';

const categories = {
  games: {
    name: 'Games',
    color: '#fae3d1',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg`,
  },
  handyBots: {
    name: 'Bots',
    color: '#c7bff0',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg`
  },
  music {
    name: 'Music',
    color: '#a9c4f7',
    url: '/music',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg`
  },
  {
    name: 'Art',
    color: '#f2a7bb',
    url: '/art',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg`
  },
  {
    name: 'Productivity',
    color: '#7aa4d3',
    url: '/tools-for-work',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg`
  },
  {
    name: 'Hardware',
    color: '#6cd8a9',
    url: '/hardware',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg`
  },
  {
    name: 'Building Blocks',
    color: '#65cad2',
    url: '/building-blocks',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbuilding-blocks.svg?v=1561575219123`,
  },
  {
    name: 'Learn to Code',
    color: '#f8d3c8',
    url: '/learn-to-code',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg?v=1561575404279`,
  },
];

<ul className={styles.categoriesGrid}>
  {categories.map((category) => (
    <li key={category.url} className={styles.categoriesGridItem} style={{ '--bg-color': category.color }}>
      <Link to={category.url}>
        <Image src={category.icon} alt="" />
        {category.name}
      </Link>
    </li>
  ))}
</ul>;
