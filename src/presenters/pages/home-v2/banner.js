import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Button, Icon, Mark } from '@fogcreek/shared-components';

import { Overlay, OverlaySection, OverlayBackground } from 'Components/overlays';
import { PopoverContainer } from 'Components/popover';
import WistiaVideo from 'Components/wistia-video';
import { useTracker } from 'State/segment-analytics';

import styles from './banner.styl';
import { emoji } from '../../../components/global.styl';

const OverlayVideoBody = () => (
  <Overlay>
    <OverlaySection type="actions">
      <div className={styles.overlayVideoWrap}>
        <WistiaVideo videoId="z2ksbcs34d" />
      </div>
    </OverlaySection>
  </Overlay>
);

const OverlayVideo = () => {
  const track = useTracker('Watch Video clicked');
  const renderOuter = ({ visible, togglePopover }) => {
    const onClick = () => {
      track();
      togglePopover();
    };
    return (
      <>
        <Button onClick={onClick}>
          Watch Video <Icon className={emoji} icon="playButton" />
        </Button>
        {visible && <OverlayBackground />}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible, closePopover }) => (visible ? <OverlayVideoBody closePopover={closePopover} /> : null)}
    </PopoverContainer>
  );
};

const InlineVideo = () => {
  const [showVideo, setShowVideo] = useState(false);
  const track = useTracker();
  const wistiaRef = React.createRef();

  const onClick = () => {
    track('Watch Video clicked');
    setShowVideo(true);
  };

  useEffect(() => {
    if (showVideo && wistiaRef.current) {
      setTimeout(() => {
        if (!wistiaRef.current) {
          return;
        }

        const pauseButton = wistiaRef.current.querySelector('[aria-label="Pause"]');
        if (pauseButton) {
          pauseButton.focus();
        }
      }, 500);
    }
  }, [showVideo, wistiaRef.current]);

  return (
    <div className={classnames(styles.bannerVideo)}>
      {showVideo ? (
        <WistiaVideo ref={wistiaRef} videoId="z2ksbcs34d" />
      ) : (
        <>
          <div className={styles.bannerVideoPoster} onClick={onClick} aria-hidden="true" />
          <span className={styles.bannerVideoButton}>
            <Button onClick={onClick}>
              Watch Video <Icon className={emoji} icon="playButton" />
            </Button>
          </span>
        </>
      )}
    </div>
  );
};

const Chrome = () => (
  <svg viewBox="0 0 578 55" aria-label="">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-622, -148)" fillRule="nonzero">
        <g transform="translate(622, 148)">
          <g>
            <rect fill="#FFFFFF" x="0" y="0" width="578" height="396" rx="5" />
            <g>
              <path d="M5,0 L573,0 C576,0 578,2 578,5 L578,57 L0,57 L0,5 C0,2 2,0 5,0 Z" fill="#847bd2" />
              <path d="M0,24 L54,24 L54,11 C54,9 56,6 59,6 L122,6 C125,6 127,9 127,11 L127,24 L578,24 L578,58 L0,58 L0,24 Z" fill="#d8d8f6" />
              <circle fill="#E8E8E8" cx="15" cy="14" r="4" />
              <circle fill="#E8E8E8" cx="27" cy="14" r="4" />
              <circle fill="#E8E8E8" cx="39" cy="14" r="4" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

const Banner = () => (
  <header id="banner" className={styles.banner}>
    <div className={styles.bannerCopyContainer}>
      <h1>
        <Unmarked>Glitch is the</Unmarked>
        <br />
        <Mark color="#1596F9" textColor="white">friendly community</Mark>
        <br />
        <Unmarked>where everyone</Unmarked>
        <br />
        <Mark color="#2EA073" textColor="white">builds the web</Mark>
      </h1>
      <div className={styles.bannerCopyAndButtons}>
        <p>Simple, powerful, free tools to create and use millions of apps.</p>
        <div className={styles.bannerButtonWrap}>
          <Button as="a" variant="cta" href="/create">
            Start Creating <Icon icon="arrowRight" />
          </Button>
          <div className={styles.watchVideoBtnWrap}>
            <OverlayVideo />
          </div>
        </div>
      </div>
    </div>
    <div className={styles.bannerVideoWrap}>
      <Chrome />
      <InlineVideo />
    </div>
  </header>
);

export default Banner;
