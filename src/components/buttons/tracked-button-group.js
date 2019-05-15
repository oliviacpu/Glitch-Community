import React from 'react';
import Button from 'Components/buttons/button';
import { useTrackedFunc } from '../../presenters/segment-analytics';

const TrackedButtonGroup = ({ children, label, onClick, ...props }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button {...props} onClick={trackedOnClick}>
      {children}
    </Button>
  );
};

export default TrackedButtonGroup;
