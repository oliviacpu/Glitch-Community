import Button from 'Components/buttons/button';
import { useTrackedFunc } from '../../presenters/segment-analytics';

const TrackedButton = ({ label, onClick }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button size="small" type="tertiary" onClick={trackedOnClick}>
      {label}
    </Button>
  );
};

export default TrackedButton;