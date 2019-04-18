import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

const Top = ({ featuredProject, collection, updateNote, hideNote, isAuthorized, ...props }) => {
  
  return (<div className={styles.top}>
    <div className={styles.left}>
      <Heading tagName="h2">
        Featured Project
        <Emoji name="clapper" />
      </Heading>
      {collection && (
        <div className={styles.note}>
          <Note
            project={featuredProject}
            collection={collection}
            updateNote={updateNote}
            hideNote={hideNote}
            isAuthorized={isAuthorized}
          />
        </div>
      )}
    </div>
    {isAuthorized && (
      <div className={styles.unfeatureBtn}>
        <FeaturedProjectOptionsPop {...props} />
      </div>
    )}
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
  const featuredProjectRef = useRef();

  useEffect(() => {
    featuredProjectRef.current.classList.add('slide-down');
  }, [featuredProject.id]);
  return (
    <div ref={featuredProjectRef}>
      <ProjectEmbed
        top={<Top
          featuredProject={featuredProject}
          collection={collection}
          hideNote={hideNote}
          updateNote={updateNote}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          displayNewNote={() => displayNewNote(featuredProject.id)}
          hasNote={!!featuredProject.note}
          featuredProjectRef={featuredProjectRef}
          canAddNote={!!collection}
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
  displayNewNote: () => {},
  hideNote: () => {},
  updateNote: () => {},
};

export default FeaturedProject;
