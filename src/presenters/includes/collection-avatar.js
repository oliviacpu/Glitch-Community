import React from 'react';
import PropTypes from 'prop-types';

import CollectionAvatarBase from 'Components/collection/defaultAvatar';
import { hexToRgbA } from 'Utils/color';

const CollectionAvatar = (props) => <CollectionAvatarBase backgroundFillColor={hexToRgbA(props.color)} />;

CollectionAvatar.propTypes = {
  color: PropTypes.string.isRequired,
};

export default CollectionAvatar;
