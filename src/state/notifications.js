import React, { useState } from 'react';

import Notification from 'Components/notification';

const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
export const useNotifications = () => React.useContext(context);

export const NotificationsProvider = (props) => {
  const [notifications, setNotifications] = useState([]);

  const create = (content, opts={}) => {
    const {type, inline, persistent} = opts;
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      type: type || 'info',
      persistent,
      inline,
      content,
    };
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
    return notification.id;
  };

  const remove = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  };

  const createError = (content = 'Something went wrong. Try refreshing?', opts={}) => {
    create(content, {type: 'error', ...opts});
  };

  const createPersistent = (content, opts) => {
    const id = create(content, {persistent: true, ...opts});
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

  const notificationsStyles = {
    zIndex: '11',
    top: '20px',
    right: '20px',
    position: 'fixed',
  };
  return (
    <>
      <Provider value={funcs}>{props.children}</Provider>
      {!!notifications.length && (
        <div style={notificationsStyles}>
          {notifications.map(({ id, content, ...args }) => (
            <Notification key={id} remove={() => remove(id)} {...args}>
              {content}
            </Notification>
          ))}
        </div>
      )}
    </>
  );
};
