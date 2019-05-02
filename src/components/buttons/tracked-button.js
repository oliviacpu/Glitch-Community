import React from 'react';
import Button from 'Components/buttons/button';
import { useTrackedFunc } from '../../presenters/segment-analytics';

const TrackedButton = ({ label, onClick, ...props }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button props={props} onClick={trackedOnClick}>
      {label}
    </Button>
  );
};

export default TrackedButton;
