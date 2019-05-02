import React from 'react';
import PropTypes from 'prop-types';

import Image from '../images/image';
import TooltipContainer from '../tooltips/tooltip-container';

const src = 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fnew-stuff-doggo-2.svg?1521578888312';

export const NewStuffPup = () => (
  <Image src={src} alt="New Stuff" width="50px" />
);

export const NewStuffPupButton = ({ onClick }) => (
  <TooltipContainer
    align={['top']}
    persistent
    target={<NewStuffPup />}
    tooltip="New"
    type="info"
  />
);
NewStuffPupButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
