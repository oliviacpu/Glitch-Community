import React, { useState } from 'react';

import Notification from 'Components/notification';

const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
export const useNotifications = () => React.useContext(context);

export function NotificationsProvider(props) {
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