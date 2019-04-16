import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _ from 'lodash';

// TODO: let's move these into components
import { AuthDescription } from './includes/description-field';
import { UserTile } from './users-list';
import { TeamTile } from './teams-list';

import { isDarkColor } from '../models/collection';

/**
 * Note Component
 */
const Note = ({ collection, project, updateNote, hideNote, isAuthorized }) => {
  function updateNoteVisibility(description) {
    description = _.trim(description);

    if (!description || description.length === 0) {
      setTimeout(() => hideNote(project.id), 500);
    }
  }

  if (!project.isAddingANewNote && !project.note) {
    return null;
  }

  const collectionCoverColor = collection.coverColor;

  const className = classNames({
    'description-container': true,
    dark: isDarkColor(collectionCoverColor),
  });

  return (
    <div className="note">
      <div className={className} style={{ backgroundColor: collectionCoverColor, borderColor: collectionCoverColor }}>
        <AuthDescription
          authorized={isAuthorized}
          description={project.note || ''}
          placeholder="Share why you love this app."
          update={(note) => updateNote({ note, projectId: project.id })}
          onBlur={updateNoteVisibility}
          allowImages
        />
      </div>
      <div className="user">{collection.teamId === -1 ? <UserTile user={collection.user} /> : <TeamTile team={collection.team} />}</div>
    </div>
  );
};

Note.propTypes = {
  project: PropTypes.shape({
    note: PropTypes.string,
    isAddingANewNote: PropTypes.bool,
    collectionCoverColor: PropTypes.string,
  }).isRequired,
  updateNote: PropTypes.func,
  hideNote: PropTypes.func,
};

Note.defaultProps = {
  updateNote: () => {},
  hideNote: () => {},
};

export default Note;
