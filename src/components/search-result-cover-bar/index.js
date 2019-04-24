/* globals CDN_URL */
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import styles from './search-result-cover-bar.styl';

const cacheBuster = Math.floor(Math.random() * 1000);

const defaultCoverURL = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';

const TeamCoverBar = ({ size, id, cache = cacheBuster }) => (
  <div className={styles.cover}>
    <Image src={`${CDN_URL}/team-cover/${id}/${size}?${cache}`} defaultSrc={defaultCoverURL} alt="" />
  </div>
);

const UserCoverBar = ({ size, id, cache = cacheBuster }) => (
  <div className={styles.cover}>
    <Image src={`${CDN_URL}/user-cover/${id}/${size}?${cache}`} defaultSrc={defaultCoverURL} alt="" />
  </div>
);

const SearchResultCoverBar = ({ type, item, size }) => {
  if (type === 'team') {
    return <TeamCoverBar size={size} id={item.id} />;
  }
  if (type === 'user') {
    return <UserCoverBar size={size} id={item.id} />;
  }
  return null;
};

SearchResultCoverBar.propTypes = {
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  size: PropTypes.oneOf(['medium', 'large']).isRequired,
};

export default SearchResultCoverBar;
