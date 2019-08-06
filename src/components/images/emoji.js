import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CDN_URL } from 'Utils/constants';
import styles from './emoji.styl';

const cx = classNames.bind(styles);

const EMOJIS = {
  ambulance: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fambulance.png',
  arrowDown: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Farrow-down.png',
  balloon: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fballoon.png',
  bentoBox: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbento-box.png',
  bicep: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbiceps.png',
  bomb: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbomb.png',
  bouquet: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbouquet.png',
  carpStreamer: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcarp_streamer.png',
  clapper: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fclapper.png?v=1564970973232',
  creditCard: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcredit-card.png?v=1564971352521',
  crystalBall: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcrystal-ball_1f52e.png',
  diamondSmall: '180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg',
  dogFace: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fdog-face.png',
  email: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Femail.png',
  eyes: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Feyes.png',
  facebook: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffacebook-logo.png?v=1565101075165',
  faceExpressionless: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-expressionless.png',
  faceSlightlySmiling: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-slightly-smiling.png',
  fastDown: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_down.png',
  fastUp: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_up.png',
  fishingPole: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffishing_pole.png',
  framedPicture: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fframed_picture.png',
  google: '2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png',
  herb: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fherb.png',
  key: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fkey.png',
  mailboxOpen: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fopen-mailbox.png',
  horizontalTrafficLight: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fhorizontal-traffic-light_1f6a5.png',
  index: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Findex.png',
  loveLetter: '7ce3d054-7a26-40e1-9268-4189fc526e5b%2Flove-letter.png',
  microphone: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fmicrophone.png',
  newspaper: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnewspaper_1f4f0.png',
  octocat: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fgithub-logo.svg',
  park: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnational-park_1f3de.png',
  playButton: '6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg',
  policeOfficer: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpolice-officer_1f46e.png',
  pushpin: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpushpin.png',
  rainbow: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Frainbow.png',
  scales: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fscales_64.png',
  sick: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-with-thermometer_1f912.png',
  slack: '1eaf9cb4-5150-4c24-bb91-28623c3b9da4%2Fslack.svg',
  sparkles: 'f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkles.png',
  sparklingHeart: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fsparkling_heart.png',
  spiralNotePad: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fspiral_note_pad.png',
  sunglasses: '6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg',
  thumbsDown: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs_down.png',
  thumbsUp: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs-up.png',
  umbrella: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fumbrella.png',
  wave: '7e047504-e283-4115-bb1a-65dc0d431fa6%2Fwave.png',
};

/**
 * Emoji Component
 */

const Emoji = ({ name, inTitle, alt }) => {
  const classNameObj = { emoji: true, [name]: true, inTitle };
  const emojiUrl = `${CDN_URL}/${EMOJIS[name]}`;

  const className = cx(classNameObj);

  return <img className={className} src={emojiUrl} alt={alt} />;
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
