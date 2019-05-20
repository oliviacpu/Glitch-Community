import React from 'react';
import PropTypes from 'prop-types';

import { useTracker } from 'State/segment-analytics';
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
            <dialog className="overlay video-overlay">
              <section className="pop-over-actions">
                <Video />
              </section>
            </dialog>
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
