import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Emoji from 'Components/images/emoji';
import Link from 'Components/link';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['tertiary', 'cta', 'dangerZone', 'dropDown'];
export const SIZES = ['small'];

/**
 * Button Component
 */

const Button = ({ onClick, href, disabled, type, size, matchBackground, hover, children, active, decorative, newTab, emoji, emojiPosition }) => {
  const className = cx({
    btn: true,
    cta: type === 'cta',
    small: size === 'small' || type === 'dangerZone', // we want to demphasize dangerous actions, so we make them small
    tertiary: ['tertiary', 'dangerZone'].includes(type),
    dangerZone: type === 'dangerZone',
    unstyled: type === 'dropDown',
    hasEmoji: emoji,
    matchBackground: matchBackground === true,
    active,
    hover,
    decorative,
  });
  
  const emojiClassName = cx({
    emojiContainer: true,
    left: emojiPosition === 'left',
  });
  
  const content = (
    <>
    </>
  )
  const emojiEl = emoji ? <div className={styles.emojiContainer}><Emoji name={emoji} /></div>: null;

  if (href) {
    let targetProps = {};
    if (newTab) {
      targetProps = {
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    return (
      <Link to={href} onClick={onClick} className={className} {...targetProps}>
        {children}{emojiEl}
      </Link>
    );
  }

  if (decorative) {
    return <span className={className}>{children}{emojiEl}</span>;
  }

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}{emojiEl}
    </button>
  );
};

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick: (props, propName, componentName) => {
    if (!props.onClick && !props.href && !props.decorative) {
      return new Error(`One of props 'onClick', 'href', 'decorative' was not specified in '${componentName}'.`);
    }
    return null;
  },
  /** OR link when button clicked */
  href: (props, propName, componentName) => {
    if (!props.onClick && !props.href && !props.decorative) {
      return new Error(`One of props 'href', 'onClick', 'decorative' was not specified in '${componentName}'.`);
    }
    return null;
  },
  /** OR its decorative, because its inside a larger button/link */
  decorative: PropTypes.bool,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
  /** whether or not the button's hover state should be active */
  hover: PropTypes.bool,
  /** whether or not the button should match its background */
  matchBackground: PropTypes.bool,
  /** whether the button is active or not */
  active: PropTypes.bool,
  /** whether the link opens in a new tab or the same window */
  newTab: PropTypes.bool,
  /** Emoji name */
  emoji: PropTypes.string,
  /** Whether Emoji is to left or right of other content */
  emojiPosition: PropTypes.oneOf(['left', 'right']),
};

Button.defaultProps = {
  onClick: null,
  href: null,
  disabled: false,
  type: null,
  size: null,
  hover: false,
  matchBackground: false,
  active: false,
  decorative: false,
  newTab: false,
  emoji: null,
  emojiPosition: 'right',
};

export default Button;
