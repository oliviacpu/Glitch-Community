import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { Icon } from '@fogcreek/shared-components';

import styles from './password-strength.styl';

const PasswordStrength = ({ strength }) => {
  const Emoji = styled(Icon)`height: 1.3em; width: 1.3em; vertical-align: sub;`;
  const labels = {
    0: <><Emoji icon="faceExpressionless" /> weak</>,
    1: <><Emoji icon="faceSlightlySmiling" /> okay</>,
    2: <><Emoji icon="faceSlightlySmiling" /> okay</>,
    3: <><Emoji icon="bicep" /> strong</>,
  };
  return (
    <div className={styles.container}>
      <progress value={Math.max(strength, 1)} max="3" className={classNames(styles.meter, styles[`score${strength}`])} />
      <span className={styles.word}>
        {labels[strength]}
      </span>
    </div>
  );
};

PasswordStrength.propTypes = {
  strength: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
};

export default PasswordStrength;
