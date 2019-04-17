import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _ from 'lodash';

import { ProfileItem } from 'Components/profile/profile-list';

// TODO: let's move these into components
import { AuthDescription } from './includes/description-field';

import { isDarkColor } from '../models/collection';

/**
 * Note Component
 */
const Note = ({ collection, project, update, hideNote }) => {
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
          authorized={!!update}
          description={project.note || ''}
          placeholder="Share why you love this app."
          update={update}
          onBlur={updateNoteVisibility}
          allowImages
        />
      </div>
      <div className="user">
        <ProfileItem user={collection.user} team={collection.team} />
      </div>
    </div>
  );
};

Note.propTypes = {
  project: PropTypes.shape({
    note: PropTypes.string,
    isAddingANewNote: PropTypes.bool,
    collectionCoverColor: PropTypes.string,
  }).isRequired,
  update: PropTypes.any,
  hideNote: PropTypes.func.isRequired,
};

Note.defaultProps = {
  update: null,
};

export default Note;
