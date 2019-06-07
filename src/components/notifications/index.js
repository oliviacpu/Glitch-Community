import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Text from 'Components/text/text';

const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
export const useNotifications = () => React.useContext(context);

const Notification = ({ children, className, remove }) => (
  <aside className={`notification ${className}`} onAnimationEnd={remove}>
    {children}
  </aside>
);

export function Notifications(props) {
  const [notifications, setNotifications] = useState([]);

  const create = (content, className = '') => {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      className,
      content,
    };
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
    return notification.id;
  };

  const remove = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  };

  const createError = (content = 'Something went wrong. Try refreshing?') => {
    create(content, 'notifyError');
  };

  const createPersistent = (content, className = '') => {
    const id = create(content, `notifyPersistent ${className}`);
    const updateNotification = (updatedContent) => {
      setNotifications((prevNotifications) => prevNotifications.map((n) => (n.id === id ? { ...n, updatedContent } : n)));
    };
    const removeNotification = () => {
      remove(id);
    };
    return {
      updateNotification,
      removeNotification,
    };
  };

  const funcs = {
    createNotification: create,
    createPersistentNotification: createPersistent,
    createErrorNotification: createError,
  };

  return (
    <>
      <Provider value={funcs}>{props.children}</Provider>
      {!!notifications.length && (
        <div className="notifications">
          {notifications.map(({ id, className, content }) => (
            <Notification key={id} className={className} remove={() => remove(id)}>
              {content}
            </Notification>
          ))}
        </div>
      )}
    </>
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
