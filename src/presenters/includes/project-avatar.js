import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';

import { FALLBACK_AVATAR_URL, getAvatarUrl } from '../../models/project';

const ProjectAvatar = ({ id }) => (
  <img
    className="avatar"
    src={getAvatarUrl(id)}
    alt=""
    onError={(event) => {
      event.target.src = FALLBACK_AVATAR_URL;
    }}
  />
);

ProjectAvatar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProjectAvatar;
