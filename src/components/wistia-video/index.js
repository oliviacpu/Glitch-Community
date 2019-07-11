import React from 'react';

const WistiaVideo = ({ videoId }) => (
  <div className="wistia_responsive_padding">
    <div className="wistia_responsive_wrapper">
      <div className={`wistia_embed wistia_async_${videoId}`} videofoam="true" />
    </div>
  </div>
);

export default WistiaVideo;
