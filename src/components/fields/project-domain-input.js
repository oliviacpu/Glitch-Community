import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const ProjectDomainInput = ({ domain, onChange, privacy }) => (
  <OptimisticTextInput
    labelText="Project Domain"
    value={domain}
    onChange={onChange}
    placeholder="Name your project"
    postfix={privacy}
  />
);

ProjectDomainInput.propTypes = {
  domain: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  privacy: PropTypes.node.isRequired,
};

export default ProjectDomainInput;
