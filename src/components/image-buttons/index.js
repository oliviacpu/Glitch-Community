import React from 'react';
import PropTypes from 'prop-types';
import Button from 'Components/buttons/button';
import { useTrackedFunc } from '../../presenters/segment-analytics';

// Image Buttons

const ImageButtons = ({ name, uploadImage, clearImage }) => {
  const onClickUpload = useTrackedFunc(uploadImage, `Upload ${name}`);
  const onClickClear = useTrackedFunc(clearImage, `Clear ${name}`);
  return (
    <div className="upload-image-buttons">
      {!!uploadImage && (
        <Button size="small" type="tertiary" onClick={onClickUpload}>
          Upload {name}
        </Button>
      )}
      {!!clearImage && (
        <Button size="small" type="tertiary" onClick={onClickClear}>
          Clear {name}
        </Button>
      )}
    </div>
  );
};
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};
ImageButtons.defaultProps = {
  uploadImage: null,
  clearImage: null,
};

export default ImageButtons;