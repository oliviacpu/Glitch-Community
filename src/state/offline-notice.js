import React, { useEffect, useState } from 'react';

import { useNotifications } from '../presenters/notifications';

const PersistentNotification = ({ children, className }) => {
  const { createPersistentNotification } = useNotifications();

  useEffect(() => {
    const { removeNotification } = createPersistentNotification(children, className);
    return removeNotification;
  }, [children, className]);

  return null;
};

const OfflineNotice = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onNetwork = () => setOnline(navigator.onLine);
    window.addEventListener('offline', onNetwork);
    window.addEventListener('online', onNetwork);
    return () => {
      window.removeEventListener('offline', onNetwork);
      window.removeEventListener('online', onNetwork);
    };
  }, []);

  if (!online) {
    return <PersistentNotification className="notifyError">It looks like you're offline</PersistentNotification>;
  }
  return null;
};

export default OfflineNotice;
