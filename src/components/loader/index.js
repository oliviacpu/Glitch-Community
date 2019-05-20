import React from 'react';
import styles from './loader.styl';

const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.moon} />
    <div className={styles.earth} />
    <div className={styles.asteroid} />
    <div className={styles.asteroidDust} />
  </div>
);

export default Loader;
