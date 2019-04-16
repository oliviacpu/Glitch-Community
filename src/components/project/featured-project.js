import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

const TopLeft = () => (

);

const TopRight = (props) => {
  if (!props.isAuthorized) return null;
  return (
    
  );
};


const Top = ({ featuredProject, collection, updateNote, hideNote, isAuthorized, ...props }) => {
  return (
    <>
      <Heading tagName="h2">
        Featured Project
        <Emoji name="clapper" />
      </Heading>
      {collection && (
        <Note
          project={featuredProject}
          collection={collection}
          updateNote={updateNote}
          hideNote={hideNote}
          isAuthorized={isAuthorized}
        />
      )}
      {isAuthorized && (
        <div className={styles.unfeatureBtn}>
          <FeaturedProjectOptionsPop {...props} />
        </div>
      )}
    </>
  );
}
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
  const featuredProjectRef = useRef();

  return (
    <div ref={featuredProjectRef}>
      <ProjectEmbed
        top{<Top
          featuredProject={featuredProject}
          collection={collection}
          hideNote={hideNote}
          updateNote={updateNote}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          displayNewNote={displayNewNote ? () => displayNewNote(featuredProject.id) : null}
          hasNote={!!featuredProject.note}
          featuredProjectRef={featuredProjectRef}
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
