import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { CDN_URL } from 'Utils/constants';

import styles from './styles.styl';

const categories = {
  games: {
    name: 'Games',
    color: '#fae3d1',
    path: '/games',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg`,
  },
  handyBots: {
    name: 'Bots',
    color: '#c7bff0',
    path: '/handy-bots',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg`,
  },
  music: {
    name: 'Music',
    color: '#a9c4f7',
    path: '/music',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg`,
  },
  art: {
    name: 'Art',
    color: '#f2a7bb',
    path: '/art',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg`,
  },
  productivity: {
    name: 'Productivity',
    color: '#7aa4d3',
    path: '/tools-for-work',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg`,
  },
  hardware: {
    name: 'Hardware',
    color: '#6cd8a9',
    path: '/hardware',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg`,
  },
  buildingBlocks: {
    name: 'Building Blocks',
    color: '#65cad2',
    path: '/building-blocks',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbuilding-blocks.svg?v=1561575219123`,
  },
  learnToCode: {
    name: 'Learn to Code',
    color: '#f8d3c8',
    path: '/learn-to-code',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg?v=1561575404279`,
  },
};

function CategoriesGrid({ categories }) {
  return (
    <ul className={styles.categoriesGrid}>
      {categories.map((category) => (
        <li key={category.path} className={styles.categoriesGridItem} style={{ '--bg-color': category.color }}>
          <Link to={category.url}>
            <Image src={category.icon} alt="" />
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default CategoriesGrid;
