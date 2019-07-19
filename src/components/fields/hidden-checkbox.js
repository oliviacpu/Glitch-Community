import React from 'react';
import styles from './hidden-checkbox.styl';

const HiddenCheckbox = ({ value, onChange, children }) => (
  <label className={styles.label}>
    <input className={styles.checkbox} type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    {children}
  </label>
);

export default HiddenCheckbox;
