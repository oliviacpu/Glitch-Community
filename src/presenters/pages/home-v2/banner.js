import React, { useState, useEffect, useRef, forwardRef } from 'react';
import classnames from 'classnames';

import Button from 'Components/buttons/button';
import { Overlay, OverlaySection, OverlayBackground } from 'Components/overlays';
import { PopoverContainer } from 'Components/popover';
import Mark from 'Components/mark';
import { useTracker } from 'State/segment-analytics';

import styles from './banner.styl';

const Arrow = () => <span aria-hidden="true">→</span>;

const videoPoster = 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fjenn_poster_small.jpg?v=1561584125641';
const videoSrc = 'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fhomepage_v4_720.mp4?v=1561656950182';

const Video = forwardRef(({ onClick, poster, src }, ref) => (
  <video ref={ref} poster={poster} onClick={onClick}>
    <source type="video/mp4" src={src} />
  </video>
));

const OverlayVideoBody = ({ closePopover }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.play();
  }, []);
  return (
    <Overlay>
      <OverlaySection type="actions">
        <Video ref={ref} onClick={closePopover} src={videoSrc} />
      </OverlaySection>
    </Overlay>
  );
};

const OverlayVideo = () => {
  const track = useTracker('Watch Video clicked');
  const renderOuter = ({ visible, togglePopover }) => {
    const onClick = () => {
      track();
      togglePopover();
    };
    return (
      <>
        <Button onClick={onClick}>Watch Video</Button>
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
  const [status, setStatus] = useState('init'); // init | playing | paused
  const track = useTracker();

  const onClick = (e) => {
    if (status === 'init') {
      track('Watch Video clicked');
    }
    if (status === 'playing') {
      e.target.pause();
      setStatus('paused');
    } else {
      e.target.play();
      setStatus('playing');
    }
  };

  return (
    <div className={classnames(styles.bannerVideo, styles[status])}>
      <Video onClick={onClick} poster={videoPoster} src={videoSrc} />
      {status === 'init' && (
        <div className={styles.bannerVideoButtonWrap}>
          <Button decorative>Watch Video</Button>
        </div>
      )}
    </div>
  );
};

const Chrome = () => (
  <svg viewBox="0 0 578 55">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-622.000000, -148.000000)" fillRule="nonzero">
        <g transform="translate(621.643282, 148.087262)">
          <g>
            <rect fill="#FFFFFF" x="-2.27373675e-13" y="0" width="578.550562" height="396" rx="5" />
            <g>
              <path
                d="M5,-2.50111043e-12 L573.550562,-2.50111043e-12 C576.311986,-2.5016177e-12 578.550562,2.23857625 578.550562,5 L578.550562,57 L0,57 L0,5 C-1.2263553e-15,2.23857625 2.23857625,-2.50060316e-12 5,-2.50111043e-12 Z"
                id="Rectangle-Copy-10"
                fill="#6356C7"
                opacity="0.806152344"
              />
              <path
                d="M2.27373675e-13,24.2075809 L54.3951641,24.2075809 L54.3951641,11.912738 C54.3951641,9.15131422 56.6337404,6.91273797 59.3951641,6.91273797 L122.98116,6.91273797 C125.742584,6.91273797 127.98116,9.15131422 127.98116,11.912738 L127.98116,24.2075809 L578.550562,24.2075809 L578.550562,58.3511734 L2.27373675e-13,58.3511734 L2.27373675e-13,24.2075809 Z"
                id="Rectangle-Copy-11"
                fill="#EBEDFF"
                opacity="0.806152344"
              />
              <circle id="Oval" fill="#E8E8E8" cx="15.1" cy="13.755152" r="4.02860638" />
              <circle id="Oval-Copy-3" fill="#E8E8E8" cx="27" cy="13.755152" r="4.02860638" />
              <circle id="Oval-Copy-5" fill="#E8E8E8" cx="38.9" cy="13.755152" r="4.02860638" />
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
        <Mark color="#1D9AF9">friendly community</Mark>
        <br />
        <Unmarked>where everyone can</Unmarked>
        <br />
        <Mark color="#18B576">create the web</Mark>
      </h1>
      <div className={styles.bannerCopyAndButtons}>
        <p>Discover, build, and share millions of apps and websites — for free</p>

        <Button type="cta" href="#top-picks">
          Start Creating <Arrow />
        </Button>
        <div className={styles.watchVideoBtnWrap}>
          <OverlayVideo />
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
