import React from 'react';
import PropTypes from 'prop-types';

import Text from 'Components/text/text';
import Image from 'Components/images/image';
import Link from 'Components/link';

const FooterLine = ({ href, track, children }) => (
  <Text>
    <Link to={href} data-track={`footer → ${track}`}>
      {children}
    </Link>
  </Text>
);

FooterLine.propTypes = {
  href: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Footer() {
  const srcForPlatforms = 'https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188';
  return (
    <footer role="contentinfo">
      <FooterLine href="/about" track="about">
        About Glitch{' '}
        <span aria-hidden="true">
          🔮
        </span>
      </FooterLine>
      <FooterLine href="/culture" track="blog">
        Blog{' '}
        <span aria-hidden="true">
          📰
        </span>
      </FooterLine>
      <FooterLine href="/help/" track="faq">
        Help Center{' '}
        <span aria-hidden="true">
          ☂️
        </span>
      </FooterLine>
      <FooterLine href="http://status.glitch.com/" track="system status">
        System Status{' '}
        <span aria-hidden="true">
          🚥
        </span>
      </FooterLine>
      <FooterLine href="/legal" track="legal stuff">
        Legal Stuff{' '}
        <span aria-hidden="true">
          👮‍
        </span>
      </FooterLine>
      <hr />
      <FooterLine href="/teams" track="platforms">
        <Image className="for-platforms-icon" src={srcForPlatforms} alt="" />
        <span className="for-platforms-text">Glitch Teams</span>
      </FooterLine>
    </footer>
  );
}
