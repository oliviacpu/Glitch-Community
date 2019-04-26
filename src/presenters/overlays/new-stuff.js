import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Text from 'Components/text/text';
import Link from 'Components/link';
import { useTracker } from '../segment-analytics';
import PopoverContainer from '../pop-overs/popover-container';
import useUserPref from '../includes/user-prefs';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff }) => (
  <dialog className="pop-over overlay new-stuff-overlay" open>
    <section className="pop-over-info">
      <figure className="new-stuff-avatar" />
      <div className="overlay-title">New Stuff</div>
      <div>
        <label className="button button-small" htmlFor="showNewStuff">
          <input
            id="showNewStuff"
            className="button-checkbox"
            type="checkbox"
            checked={showNewStuff}
            onChange={(evt) => setShowNewStuff(evt.target.checked)}
          />
          Keep showing me these
        </label>
      </div>
    </section>
    <section className="pop-over-actions">
      {newStuff.map(({ id, title, body, link }) => (
        <article key={id}>
          <div className="title">{title}</div>
          <div className="body">
            <Markdown>{body}</Markdown>
          </div>
          {!!link && (
            <Text>
              <Link className="link" to={link}>
                Read the blog post →
              </Link>
            </Text>
          )}
        </article>
      ))}
    </section>
  </dialog>
);
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

const NewStuff = ({ children, isSignedIn, showNewStuff, setShowNewStuff, newStuffReadId, setNewStuffReadId }) => {
  const [log, setLog] = React.useState(newStuffLog);
  const track = useTracker('Pupdate');

  const renderOuter = ({ visible, setVisible }) => {
    const dogVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;

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
        {dogVisible && (
          <div className="new-stuff-footer">
            <TooltipContainer
              id="new-stuff-tooltip"
              type="info"
              target={
                <button className="button-unstyled new-stuff" onClick={show}>
                  <figure className="new-stuff-avatar" alt="New Stuff" />
                </button>
              }
              tooltip="New"
              persistent
              align={['top']}
            />
          </div>
        )}
        {visible && <div className="overlay-background" role="presentation" />}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible }) => (visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} /> : null)}
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuffReadId: PropTypes.number.isRequired,
  setNewStuffReadId: PropTypes.func.isRequired,
};

const NewStuffContainer = ({ children, isSignedIn }) => {
  const [showNewStuff, setShowNewStuff] = useUserPref('showNewStuff', true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref('newStuffReadId', 0);

  return (
    <NewStuff
      {...{
        isSignedIn,
        showNewStuff,
        newStuffReadId,
        setShowNewStuff,
        setNewStuffReadId,
      }}
    >
      {children}
    </NewStuff>
  );
};
NewStuffContainer.propTypes = {
  children: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
};

export default NewStuffContainer;
