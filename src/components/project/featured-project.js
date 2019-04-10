import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

const TopLeft = ({ featuredProject, collection, updateNote, hideNote, isAuthorized }) => (
  <Heading tagName="h2">
    Featured Project
    <Emoji name="clapper" />
    {collection && (<Note
      project={featuredProject}
      collection={collection}
      updateNote={updateNote}
      hideNote={hideNote}
      isAuthorized={isAuthorized}
    />)}
  </Heading>
);

const TopRight = (props) => {
  if (!props.isAuthorized) return null;
  return (
    <div className={styles.unfeatureBtn}>
      <FeaturedProjectOptionsPop {...props} />
    </div>
  );
};

const FeaturedProject = ({
  addProjectToCollection,
  collection,
  currentUser,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  updateNote,
  unfeatureProject,
}) => {
  

  return (
    <div ref={() => }>
      <ProjectEmbed
      topLeft={<TopLeft
        featuredProject={featuredProject}
        collection={collection}
        hideNote={hideNote}
        updateNote={updateNote}
        isAuthorized={isAuthorized}
      />}
      topRight={<TopRight
        isAuthorized={isAuthorized}
        unfeatureProject={unfeatureProject}
        displayNewNote={displayNewNote ? () => displayNewNote(featuredProject.id) : null}
        hasNote={!!featuredProject.note}
        featuredProjectSectionRef={featuredProjectSectionRef}
      />}
      project={featuredProject}
      isAuthorized={isAuthorized}
      currentUser={currentUser}
      addProjectToCollection={addProjectToCollection}
    />
    </div>
  );
};


FeaturedProject.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  featuredProject: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  collection: PropTypes.object,
  displayNewNote: PropTypes.func,
  hideNote: PropTypes.func,
  updateNote: PropTypes.func,
};

FeaturedProject.defaultProps = {
  collection: null,
  displayNewNote: null,
  hideNote: null,
  updateNote: null,
};

export default FeaturedProject;
