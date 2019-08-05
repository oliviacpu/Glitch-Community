import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './emoji.styl';

const cx = classNames.bind(styles);

const EMOJIS = {
  ambulance: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fambulance.png',
  arrowDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Farrow-down.png?v=1564970974905',
  balloon: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fballoon.png?v=1564970970817',
  bentoBox: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbento-box.png?v=1564970971725',
  bicep: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbiceps.png?v=1564970966662',
  bomb: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbomb.png?v=1564970972832',
  bouquet: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbouquet.png?v=1564971244946',
  carpStreamer: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcarp_streamer.png?v=1564970976579',
  clapper: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fclapper.png?v=1564970973232',
  creditCard: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcredit-card.png?v=1564971352521',
  crystalBall: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcrystal-ball_1f52e.png?v=1564970981501',
  diamondSmall: 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg',
  dogFace: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fdog-face.png?v=1564970983282',
  email: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Femail.png?v=1564970978599',
  eyes: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Feyes.png?v=1564970977173',
  facebook: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffacebook-logo.png',
  faceExpressionless: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-expressionless.png?v=1564970981022',
  faceSlightlySmiling: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-slightly-smiling.png?v=1564970981947',
  fastDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_down.png?v=1564970985280',
  fastUp: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_up.png?v=1564970983899',
  fishingPole: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffishing_pole.png?v=1564970986134',
  framedPicture: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fframed_picture.png?v=1564970984376',
  google: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png',
  herb: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fherb.png?v=1564970986554',
  key: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fkey.png?v=1564970965646',
  mailboxOpen: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fopen-mailbox.png?v=1564970969144',
  horizontalTrafficLight: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fhorizontal-traffic-light_1f6a5.png?v=1564970986991',
  index: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Findex.png?v=1564970967077',
  loveLetter: 'https://cdn.glitch.com/7ce3d054-7a26-40e1-9268-4189fc526e5b%2Flove-letter.png?v=1562660085578',
  microphone: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fmicrophone.png?v=1564970968679',
  newspaper: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnewspaper_1f4f0.png?v=1564970966213',
  octocat: 'https://gomix.com/images/emojis/github-logo-light.svg',
  park: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnational-park_1f3de.png?v=1564970967607',
  playButton: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg',
  policeOfficer: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpolice-officer_1f46e.png?v=1564970970396',
  pushpin: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpushpin.png?v=1564970969569',
  rainbow: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Frainbow.png?v=1564971353139',
  scales: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fscales_64.png?v=1564970969980',
  sick: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-with-thermometer_1f912.png?v=1564970982683',
  slack: 'https://cdn.glitch.com/1eaf9cb4-5150-4c24-bb91-28623c3b9da4%2Fslack.svg',
  sparkles: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkles.png',
  sparklingHeart: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fsparkling_heart.png?v=1564970974476',
  spiralNotePad: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fspiral_note_pad.png?v=1564970972430',
  sunglasses: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg',
  thumbsDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs_down.png?v=1564970973638',
  thumbsUp: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs-up.png?v=1564970975340',
  umbrella: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fumbrella.png?v=1564970974046',
  wave: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fwave.png?v=1564970991639',
};

/**
 * Emoji Component
 */

const Emoji = ({ name, inTitle, alt }) => {
  const classNameObj = { emoji: true, [name]: true, inTitle };

  const className = cx(classNameObj);

  return <img className={className} src={EMOJIS[name]} alt={alt} />;
};

Emoji.propTypes = {
  /** element(s) to display in the button */
  name: PropTypes.oneOf(Object.keys(EMOJIS)).isRequired,
  inTitle: PropTypes.bool,
  alt: PropTypes.string,
};

Emoji.defaultProps = {
  inTitle: false,
  alt: '',
};

export default Emoji;
