import React from 'react';
import PropTypes from 'prop-types';

import Overlay from 'Components/overlays/overlay';
import OverlaySection from 'Components/overlays/overlay-section';

import { useTracker } from '../segment-analytics';
import PopoverContainer from '../pop-overs/popover-container';

const Video = () => (
  <div className="wistia_responsive_padding">
    <div className="wistia_responsive_wrapper">
      <div className="wistia_embed wistia_async_i0m98yntdb" videofoam="true" />
    </div>
  </div>
);

const OverlayVideo = ({ children }) => {
  const track = useTracker('How it works clicked');
  return (
    <PopoverContainer>
      {({ visible, setVisible }) => {
        const onToggle = (evt) => {
          setVisible(evt.target.open);
          if (evt.target.open) {
            track();
          }
        };
        return (
          <details onToggle={onToggle} open={visible} className="overlay-container">
            <summary>{children}</summary>
            <Overlay className="video-overlay">
              <OverlaySection type="actions">
                <Video />
              </OverlaySection>
            </Overlay>
          </details>
        );
      }}
    </PopoverContainer>
  );
};
OverlayVideo.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlayVideo;
