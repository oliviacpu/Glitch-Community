import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'

import Text from 'Components/text/text';
import Image from 'Components/images/image';
import Emoji from 'Components/images/emoji';
import { Link } from '../../presenters/includes/link';
import styles from './footer.styl';

const FooterLine = ({ className, href, track, children }) => (
  <Link className={classnames(styles.footerLine, className)} to={href} data-track={`footer → ${track}`}>
    {children}
  </Link>
);

const PlatformsIcon = () => (
  <Image
    className="for-platforms-icon"
    src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188"
    alt=""
  />
);

const Footer = () => (
  <footer className={styles.container} role="contentinfo">
    <FooterLine href="/about" track="about">
      About Glitch
      <Emoji name="crystalBall" />
    </FooterLine>
    <FooterLine href="/culture" track="blog">
      Blog
      <Emoji name="newspaper" />
    </FooterLine>
    <FooterLine href="/help/" track="faq">
      Help Center
      <Emoji name="umbrella" />
    </FooterLine>
    <FooterLine href="http://status.glitch.com/" track="system status">
      System Status
      <Emoji name="horizontalTrafficLight" />
    </FooterLine>
    <FooterLine href="/legal" track="legal stuff">
      Legal Stuff
      <Emoji name="policeOfficer" />
    </FooterLine>
    <FooterLine className={styles.teams} href="/teams" track="platforms">
      <PlatformsIcon/> Glitch Teams
    </FooterLine>
  </footer>
);

export default Footer;
