import React from 'react';
import PropTypes from 'prop-types';

import Text from 'Components/text/text';
import styles from 'styles.styl';

export default function Notification({ children, className, remove }) {
  return (
    <aside className={`styles.notification ${className}`} onAnimationEnd={remove}>
      {children}
    </aside>
  );
}

export const AddProjectToCollectionMsg = ({ projectDomain, collectionName, url }) => (
  <>
    <Text>
      {`Added ${projectDomain} `}
      {collectionName && `to collection ${collectionName}`}
    </Text>
    {url && (
      <a href={url} rel="noopener noreferrer" className="button button-small button-tertiary button-in-notification-container notify-collection-link">
        Take me there
      </a>
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
