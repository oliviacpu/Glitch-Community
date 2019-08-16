import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Icon } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import Link from 'Components/link';
import styles from './footer.styl';

const FooterLink = ({ className, href, track, children }) => (
  <div className={classnames(styles.footerLinkWrap, className)}>
    <Link className={styles.footerLink} to={href} data-track={`footer → ${track}`}>
      {children}
    </Link>
  </div>
);

const PlatformsIcon = () => (
  <Image
    className={styles.platformsIcon}
    src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188"
    alt=""
  />
);

function Footer() {
  return (
    <footer className={styles.container} role="contentinfo">
      <FooterLink href="/about" track="about">
        About Glitch
        <Icon className={styles.emoji} icon="crystalBall" />
      </FooterLink>
      <FooterLink href="/culture" track="blog">
        Blog
        <Icon className={styles.emoji} icon="newspaper" />
      </FooterLink>
      <FooterLink href="/help/" track="faq">
        Help Center
        <Icon className={styles.emoji} icon="umbrella" />
      </FooterLink>
      <FooterLink href="http://status.glitch.com/" track="system status">
        System Status
        <Icon className={styles.emoji} icon="horizontalTrafficLight" />
      </FooterLink>
      <FooterLink href="/legal" track="legal stuff">
        Legal Stuff
        <Icon className={styles.emoji} icon="scales" />
      </FooterLink>
      <FooterLink className={styles.teams} href="/teams" track="platforms">
        <PlatformsIcon />
        Glitch Teams
      </FooterLink>
    </footer>
  );
}

export default Footer;
