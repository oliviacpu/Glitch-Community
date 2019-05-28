import React from 'react';

import { uploadAsset, uploadAssetSizes } from '../../utils/assets';
import { captureException } from '../../utils/sentry';
import { useNotifications } from '../notifications';

const NotifyUploading = ({ progress }) => (
  <>
    Uploading asset
    <progress className="notify-progress" value={progress} />
  </>
);
const NotifyError = ({ e }) => {
  if (e && Object.hasOwnProperty.call(e, "status_code") && e.status_code === 0) {
    return 'File upload failed. Check your firewall settings and try again?';
  }
  return 'File upload failed. Try again in a few minutes?';
};

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const { updateNotification, removeNotification } = notifications.createPersistentNotification(
    <NotifyUploading progress={progress} />,
    'notifyUploading',
  );
  try {
    result = await upload(({ lengthComputable, loaded, total }) => {
      if (lengthComputable) {
        progress = loaded / total;
      } else {
        progress = (progress + 1) / 2;
      }
      updateNotification(<NotifyUploading progress={progress} />);
    });
  } catch (e) {
    captureException(e);
    notifications.createErrorNotification(<NotifyError e={e} />);
    removeNotification();
    return result;
  }
  
  removeNotification();
  notifications.createNotification('Image uploaded!');
  return result;
}

const useUploader = () => {
  const notifications = useNotifications();
  return {
    uploadAsset: (blob, policy, key) => uploadWrapper(notifications, (cb) => uploadAsset(blob, policy, key, cb)),
    uploadAssetSizes: (blob, policy, sizes) => uploadWrapper(notifications, (cb) => uploadAssetSizes(blob, policy, sizes, cb)),
  };
};

export default useUploader;
