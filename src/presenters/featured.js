/* eslint-disable camelcase */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';
import Image from 'Components/images/image';
import MaskImage from 'Components/images/mask-image';

import Link from 'Components/link';
import FeaturedItems from '../curated/featured';
import FeaturedEmbedObject from '../curated/featured-embed';


import FeaturedEmbed from './featured-embed';
import { FeaturedCollections } from './featured-collections';

const ZineItems = () => {
  const { current: posts } = useRef(window.ZINE_POSTS.slice(0, 4));
  const { current: masks } = useRef(sampleSize([1, 2, 3, 4, 5], 4));
  if (!posts.length) {
    return null;
  }
  return (
    <section>
      <ul className="zine-items">
        {posts.map(({ id, title, url, feature_image, primary_tag }, n) => (
          <li key={id} className="zine-item">
            <Link to={`/culture${url}`}>
              {!!feature_image && (
                <div className="mask-container">
                  <MaskImage maskClass={`mask${masks[n]}`} src={feature_image} />
                </div>
              )}
              <div className="zine-item-meta">
                <h1 className="zine-item-title">{title}</h1>
                {!!primary_tag && <p className="zine-item-tag">{primary_tag.name}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

const FeaturedPanel = ({ img, link, title }) => (
  <Link to={link} data-track="featured-project" data-track-label={title}>
    <div className="featured-container">
      <Image className="featured" src={img} alt="" />
      <p className="project-name">{title}</p>
    </div>
  </Link>
);
FeaturedPanel.propTypes = {
  img: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Featured = ({ featured }) => (
  <section className="featured">
    <div className="community-pick-embed-container">
      <FeaturedEmbed {...FeaturedEmbedObject} />
    </div>

    <section>
      <ul className="featured-items">
        {featured.map((item) => (
          <li key={item.link}>
            <FeaturedPanel {...item} />
          </li>
        ))}
      </ul>
    </section>

    <ZineItems />
    <FeaturedCollections />
  </section>
);
Featured.propTypes = {
  featured: PropTypes.array.isRequired,
};

const FeaturedContainer = ({ isAuthorized }) => <Featured featured={FeaturedItems} isAuthorized={isAuthorized} />;

FeaturedContainer.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

export default FeaturedContainer;

/* eslint-enable camelcase */
