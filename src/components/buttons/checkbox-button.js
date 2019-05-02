import React from 'react';
import PropTypes from 'prop-types';

import styles from './button.styl';

const CheckboxButton = ({ }) => (
  <label className="button button-small" htmlFor="showNewStuff">
    <input
      id="showNewStuff"
      className="button-checkbox"
      type="checkbox"
      checked={showNewStuff}
      onChange={(evt) => setShowNewStuff(evt.target.checked)}
    />
    Keep showing me these
  </label>
);