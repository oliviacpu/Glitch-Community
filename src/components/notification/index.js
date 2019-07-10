import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LiveMessage, LiveAnnouncer } from 'react-aria-live';

import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import classNames from 'classnames/bind';
import styles from './styles.styl';

const cx = classNames.bind(styles);

const Notification = ({ children, type, persistent, inline, remove }) => {
  const el = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(
    () => {
      console.log('useeffect');
      setMessage(el.current.innerText);
    },
    [el],
  );

  const className = cx({
    notification: true,
    success: type === 'success',
    error: type === 'error',
    persistent,
    inline,
  });

  return (
    <>
      <LiveMessage aria-live="polite" message={`${type}: ${message}`} />
      <aside aria-live="polite" ref={el} className={className} onAnimationEnd={remove}>
        {children}
        <button onClick={() => setMessage('butts')}>Click for butts</button>
      </aside>
    </>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error']),
  persistent: PropTypes.bool,
  inline: PropTypes.bool,
};

Notification.defaultProps = {
  type: 'info',
  persistent: false,
  inline: false,
};

export const AddProjectToCollectionMsg = ({ projectDomain, collectionName, url }) => (
  <>
    <Text>
      {`Added ${projectDomain} `}
      {collectionName && `to collection ${collectionName}`}
    </Text>
    {url && (
      <Button href={url} rel="noopener noreferrer" size="small" type="tertiary">
        Take me there
      </Button>
    )}
  </>
);

AddProjectToCollectionMsg.propTypes = {
  projectDomain: PropTypes.string.isRequired,
  collectionName: PropTypes.string,
  url: PropTypes.string,
};

AddProjectToCollectionMsg.defaultProps = {
  url: null,
  collectionName: null,
};

export default Notification;
