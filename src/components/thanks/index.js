import React from 'react';
import PropTypes from 'prop-types';
import Emoji from 'Components/images/emoji';
import styles from './thanks.styl';

const thanksText = (count) => {
  if (count === 1) {
    return 'Thanked once';
  }
  if (count === 2) {
    return 'Thanked twice';
  }
  return `Thanked ${count} times`;
};

const ThanksLong = ({ count }) => (
  <p className={styles.container}>
    {thanksText(count)}
    &nbsp;
    <Emoji name="sparklingHeart" />
  </p>
);

const ThanksShort = ({ count }) => (
  <p className={styles.container}>
    <Emoji name="sparklingHeart" />
    &nbsp;
    {count}
  </p>
);

const Thanks = ({ count, short }) => {
  if (count <= 0) return null;
  if (short) return <ThanksShort count={count} />;
  return <ThanksLong count={count} />;
};

Thanks.propTypes = {
  count: PropTypes.number.isRequired,
  short: PropTypes.bool,
};

Thanks.defaultProps = {
  short: false,
};

export default Thanks;
