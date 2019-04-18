import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const ProjectDomainInput = ({ domain, onChange, suffix }) => (
  <OptimisticTextInput
    labelText="Project Domain"
    value={domain}
    onChange={onChange}
    placeholder="Name your project"
    suffix={suffix}
  />
);

ProjectDomainInput.propTypes = {
  domain: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suffix: PropTypes.node.isRequired,
};

export default ProjectDomainInput;
