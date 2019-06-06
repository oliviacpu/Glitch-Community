import React from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import NewStuffArticle from 'Components/new-stuff/new-stuff-article';
import NewStuffPrompt from 'Components/new-stuff/new-stuff-prompt';
import NewStuffPup from 'Components/new-stuff/new-stuff-pup';
import CheckboxButton from 'Components/buttons/checkbox-button';
import Emoji from 'Components/images/emoji';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';
import PopoverContainer from '../pop-overs/popover-container';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

const useRestrictKeyboardFocusToDialog = () => {
  const [focus, setFocus] = React.useState(0);
  const ref = React.useRef();

  React.useEffect(() => {
    const dialog = ref.current;
    if (dialog) {
      const focusableElements =
        'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])';
      const focusableDialogElements = dialog.querySelectorAll(focusableElements);
      const focusableItems = [...focusableDialogElements];
      const keyHandler = (event) => {
        // user tabs only within the elements of the dialog in a circle (not anything outside of it)
        if (['Tab'].includes(event.key)) {
          event.preventDefault();
          event.stopPropagation();

          let newFocus;
          if (event.shiftKey) {
            // tab backwards
            newFocus = focus - 1 >= 0 ? focus - 1 : focusableItems.length - 1;
          } else {
            // tab forwards
            newFocus = focus + 1 < focusableItems.length ? focus + 1 : 0;
          }

          focusableItems[newFocus].focus();
          setFocus(newFocus);
        }
      };
      window.addEventListener('keydown', keyHandler);
      return () => window.removeEventListener('keydown', keyHandler);
    }
    return () => {};
  }, [focus]);

  return ref;
};

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff, setVisible }) => {
  const newStuffOverlayRef = useRestrictKeyboardFocusToDialog();

  return (
    <Overlay className="new-stuff-overlay" ref={newStuffOverlayRef} ariaModal ariaLabelledBy="newStuff">
      <OverlaySection type="info">
        <div className="new-stuff-avatar">
          <NewStuffPup />
        </div>
        <OverlayTitle id="newStuff">New Stuff</OverlayTitle>
        <div className="new-stuff-toggle">
          <CheckboxButton value={showNewStuff} onChange={setShowNewStuff}>
            Keep showing me these
          </CheckboxButton>
        </div>
      </OverlaySection>
      <OverlaySection type="actions">
        {newStuff.map(({ id, ...props }) => (
          <NewStuffArticle key={id} {...props} />
        ))}
        <button onClick={() => setVisible(false)}>
          Back to Glitch <Emoji name="carpStreamer" />
        </button>
      </OverlaySection>
    </Overlay>
  );
};
NewStuffOverlay.propTypes = {
  setShowNewStuff: PropTypes.func.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      link: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

const NewStuff = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const isSignedIn = !!currentUser && !!currentUser.login;
  const [showNewStuff, setShowNewStuff] = useUserPref('showNewStuff', true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref('newStuffReadId', 0);
  const [log, setLog] = React.useState(newStuffLog);
  const track = useTracker('Pupdate');

  const renderOuter = ({ visible, setVisible }) => {
    const pupVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const show = () => {
      track();
      setVisible(true);
      const unreadStuff = newStuffLog.filter(({ id }) => id > newStuffReadId);
      setLog(unreadStuff.length ? unreadStuff : newStuffLog);
      setNewStuffReadId(latestId);
    };

    return (
      <>
        {children(show)}
        {pupVisible && <NewStuffPrompt onClick={show} />}
        {visible && <div className="overlay-background" role="presentation" tabIndex={-1} />}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible, setVisible }) =>
        visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} setVisible={setVisible} /> : null
      }
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuff;
