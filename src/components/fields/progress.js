import React from 'react';
import classnames from 'classnames';
import styles from './progress.styl';

export default ({ className, ...props }) => (
  <progress className={classnames(className, styles.progress)} {...props} />
);
