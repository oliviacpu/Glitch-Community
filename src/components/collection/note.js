import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _ from 'lodash';

import { ProfileItem } from 'Components/profile/profile-list';

import styles from './note.styl';

// TODO: let's move these into components
import { AuthDescription } from '../../presenters/includes/description-field';

import { isDarkColor } from '../../models/collection';

const cx = classNames.bind(styles);

/**
 * Note Component
 */
const Note = ({ collection, project, updateNote, hideNote, isAuthorized }) => {
  function hideEmptyNote(description) {
    description = _.trim(description);
    if (!description || description.length === 0) {
      setTimeout(() => hideNote(project.id), 500);
    }
  }

  if (!project.isAddingANewNote && !project.note) {
    return null;
  }

  const collectionCoverColor = collection.coverColor;

  return (
    <div className={styles.note}>
      <div className={cx({ descriptionContainer: true, dark: isDarkColor(collectionCoverColor) })} style={{ backgroundColor: collectionCoverColor, borderColor: collectionCoverColor }}>
        <AuthDescription
          authorized={isAuthorized}
          description={project.note || ''}
          placeholder="Share why you love this app."
          update={(note) => updateNote({ note, projectId: project.id })}
          onBlur={hideEmptyNote}
          allowImages
        />
      </div>
      <div className={styles.user}>
        <ProfileItem user={collection.user} team={collection.team} />
      </div>
    </div>
  );
};

Note.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
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
