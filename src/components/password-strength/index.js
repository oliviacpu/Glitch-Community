import React from 'react';
import PropTypes from 'prop-types';

import Emoji from 'Components/emoji';

const PasswordStrength = ({ strength }) => {
  return (
    <div className="pw-strength">
      <progress value={Math.max(passwordStrength, 1)} max="3" className={`pw-strength score-${passwordStrength}`} />
      <span className="pw-strength-word">
        {passwordStrength === 0 && (
          <>
            <Emoji name="faceExpressionless" /> weak
          </>
        )}
        {(passwordStrength === 1 || passwordStrength === 2) && (
          <>
            <Emoji name="faceSlightlySmiling" /> okay
          </>
        )}
        {passwordStrength === 3 && (
          <>
            <Emoji name="bicep" /> strong
          </>
        )}
      </span>
    </div>
  );
};

PasswordStrength.propTypes = {
  strength: PropTypes.oneOf([0, 1, 2, 3]),
};

export default PasswordStrength;
