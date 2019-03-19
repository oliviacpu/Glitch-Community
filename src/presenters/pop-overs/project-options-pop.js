import React from 'react';
import PropTypes from 'prop-types';

import { TrackClick } from '../analytics';
import PopoverWithButton from './popover-with-button';
import { NestedPopover } from './popover-nested';
import { useCurrentUser } from '../../state/current-user';

import AddProjectToCollectionPop from './add-project-to-collection-pop';

const PopoverButton = ({ onClick, text, emoji }) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick} type="button">
    <span>{`${text} `}</span>
    <span className={`emoji ${emoji}`} />
  </button>
);

// Project Options Content
const ProjectOptionsContent = ({ addToCollectionPopover, ...props }) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, { once: true });
    projectContainer.classList.add(className);
    props.togglePopover();
  }

  function leaveProject(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${
      props.project.domain
    }?`;
    if (window.confirm(prompt)) {
      props.leaveProject(props.project.id, event);
    }
  }

  function leaveTeamProject() {
    props.leaveTeamProject(props.project.id, props.currentUser.id);
  }

  function joinTeamProject() {
    props.joinTeamProject(props.project.id, props.currentUser);
  }

  function animateThenAddPin(event) {
    animate(event, 'slide-up', () => props.addPin(props.project.id));
  }

  function animateThenRemovePin(event) {
    animate(event, 'slide-down', () => props.removePin(props.project.id));
  }

  function animateThenDeleteProject(event) {
    animate(event, 'slide-down', () => props.deleteProject(props.project.id));
  }

  function featureProject(event) {
    animate(event, 'slide-up', () => props.featureProject(props.project.id));
  }
  const showLeaveProject = props.leaveProject && props.project.users.length > 1 && props.currentUserIsOnProject;
  return (
    <dialog className="pop-over project-options-pop">
      {!!props.addPin && (
        <section className="pop-over-actions">
          {!props.project.private && <PopoverButton onClick={featureProject} text="Feature" emoji="clapper" />}
          <TrackClick name="Project Pinned">
            <PopoverButton onClick={animateThenAddPin} text="Pin " emoji="pushpin" />
          </TrackClick>
        </section>
      )}
      {!!props.removePin && (
        <section className="pop-over-actions">
          {!props.project.private && <PopoverButton onClick={featureProject} text="Feature" emoji="clapper" />}
          <TrackClick name="Project Un-Pinned">
            <PopoverButton onClick={animateThenRemovePin} text="Un-Pin " emoji="pushpin" />
          </TrackClick>
        </section>
      )}

      {!!props.addProjectToCollection && (
        <section className="pop-over-actions">
          <PopoverButton onClick={addToCollectionPopover} {...props} text="Add to Collection " emoji="framed-picture" />
        </section>
      )}

      {props.joinTeamProject && !props.currentUserIsOnProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={joinTeamProject} text="Join Project " emoji="rainbow" />
        </section>
      )}

      {props.leaveTeamProject && props.currentUserIsOnProject && (
        <section className="pop-over-actions collaborator-actions">
          <TrackClick name="Leave Project clicked">
            <PopoverButton onClick={leaveTeamProject} text="Leave Project " emoji="wave" />
          </TrackClick>
        </section>
      )}

      {showLeaveProject && (
        <section className="pop-over-actions collaborator-actions">
          <TrackClick name="Leave Project clicked">
            <PopoverButton onClick={leaveProject} text="Leave Project " emoji="wave" />
          </TrackClick>
        </section>
      )}

      {(props.currentUserIsOnProject || !!props.removeProjectFromTeam) && !props.removeProjectFromCollection && (
        <section className="pop-over-actions danger-zone last-section">
          {!!props.removeProjectFromTeam && (
            <PopoverButton onClick={() => props.removeProjectFromTeam(props.project.id)} text="Remove Project " emoji="thumbs_down" />
          )}

          {props.currentUserIsOnProject && !props.removeProjectFromCollection && (
            <TrackClick name="Delete Project clicked">
              <PopoverButton onClick={animateThenDeleteProject} text="Delete Project " emoji="bomb" />
            </TrackClick>
          )}
        </section>
      )}
      {props.removeProjectFromCollection && (
        <section className="pop-over-actions danger-zone last-section">
          {props.removeProjectFromCollection && (
            <PopoverButton onClick={() => props.removeProjectFromCollection(props.project)} text="Remove from Collection" emoji="thumbs_down" />
          )}
        </section>
      )}
    </dialog>
  );
};

// Project Options Pop
const ProjectOptionsPop = ({ ...props }) => (
  <NestedPopover alternateContent={() => <AddProjectToCollectionPop {...props} togglePopover={props.togglePopover} />}>
    {(addToCollectionPopover) => <ProjectOptionsContent {...props} addToCollectionPopover={addToCollectionPopover} />}
  </NestedPopover>
);

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    users: PropTypes.array.isRequired,
  }).isRequired,
  togglePopover: PropTypes.func.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
  featureProject: PropTypes.func,
  currentUserIsOnProject: PropTypes.bool,
};
ProjectOptionsPop.defaultProps = {
  currentUserIsOnProject: false,
  addPin: null,
  removePin: null,
  deleteProject: null,
  leaveProject: null,
  removeProjectFromTeam: null,
  joinTeamProject: null,
  leaveTeamProject: null,
  featureProject: null,
};

function currentUserIsOnProject(user, project) {
  const projectUsers = project.users.map((projectUser) => projectUser.id);
  if (projectUsers.includes(user.id)) {
    return true;
  }
  return false;
}

const ForwardProps = ({ children, ...props }) => children(props);

// Project Options Container
// create as stateful react component
export default function ProjectOptions({ projectOptions, project }, { ...props }) {
  const currentUser = useCurrentUser();

  if (Object.keys(projectOptions).length === 0) {
    return null;
  }

  return (
    <PopoverWithButton
      buttonClass="project-options button-borderless button-small"
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="project-options-pop-btn"
      passToggleToPop
    >
      <ForwardProps>
        {(consumerProps) => (
          <ProjectOptionsPop
            {...props}
            {...projectOptions}
            {...consumerProps}
            project={project}
            currentUser={currentUser}
            currentUserIsOnProject={currentUserIsOnProject(currentUser, project)}
          />
        )}
      </ForwardProps>
    </PopoverWithButton>
  );
}

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptions.defaultProps = {
  projectOptions: {},
};
