import React from 'react';
import PropTypes from 'prop-types';

import { useTrackedFunc } from '../segment-analytics';
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

const ProjectOptionsContent = ({ addToCollectionPopover, ...props }) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, { once: true });
    projectContainer.classList.add(className);
    props.togglePopover();
  }

  function isTeamProject() {
    const { currentUser, project } = props;
    for (const team of currentUser.teams) {
      if (project.teamIds.includes(team.id)) {
        return true;
      }
    }
    return false;
  }

  function leaveProject(event) {
    if (isTeamProject()) {
      props.leaveProject(props.project.id, event);
      return;
    }

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
    props.addPin(props.project.id);
  }

  function animateThenRemovePin(event) {
    props.removePin(props.project.id));
  }

  function animateThenDeleteProject(event) {
    animate(event, 'slide-down', () => props.deleteProject(props.project.id));
  }

  function animateThenRemoveProjectFromTeam(event) {
    animate(event, 'slide-down', () => props.removeProjectFromTeam(props.project.id));
  }

  function featureProject(event) {
    animate(event, 'slide-up', () => props.featureProject(props.project.id));
  }

  function toggleAndDisplayNote() {
    props.togglePopover();
    props.displayNewNote(props.project.id);
  }

  const showLeaveProject = props.leaveProject && props.project.users.length > 1 && props.currentUserIsOnProject;
  const showAddNote = !(props.project.note || props.project.isAddingANewNote) && !!props.displayNewNote;
  const showPinOrFeatureSection = (props.addPin || props.removePin || (props.featureProject && !props.project.private));
  const showRemoveProjectFromTeam = !!props.removeProjectFromTeam && !props.removeProjectFromCollection;
  const showDeleteProject = props.currentUserIsAdminOnProject && !props.removeProjectFromCollection;
  const showDangerZone = showRemoveProjectFromTeam || showDeleteProject || props.removeProjectFromCollection;

  const onClickAddPin = useTrackedFunc(animateThenAddPin, 'Project Pinned');
  const onClickRemovePin = useTrackedFunc(animateThenRemovePin, 'Project Un-Pinned');
  const onClickLeaveTeamProject = useTrackedFunc(leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(animateThenDeleteProject, 'Delete Project clicked');

  return (
    <dialog className="pop-over project-options-pop">
      { showPinOrFeatureSection && (
        <section className="pop-over-actions">
          {!!props.featureProject && !props.project.private && (
            <PopoverButton onClick={featureProject} text="Feature" emoji="clapper" />
          )}
          {!!props.addPin && (
            <PopoverButton onClick={onClickAddPin} text="Pin " emoji="pushpin" />
          )}
          {!!props.removePin && (
            <PopoverButton onClick={onClickRemovePin} text="Un-Pin " emoji="pushpin" />
          )}
        </section>
      )}
      {showAddNote && (
        <section className="pop-over-actions">
          <PopoverButton onClick={toggleAndDisplayNote} {...props} text="Add Note" emoji="spiral_note_pad" />
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
          <PopoverButton onClick={onClickLeaveTeamProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {showLeaveProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {showDangerZone && (
        <section className="pop-over-actions danger-zone last-section">
          {showRemoveProjectFromTeam && (
            <PopoverButton onClick={animateThenRemoveProjectFromTeam} text="Remove Project " emoji="thumbs_down" />
          )}

          {showDeleteProject && (
            <PopoverButton onClick={onClickDeleteProject} text="Delete Project " emoji="bomb" />
          )}

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
  currentUser: PropTypes.object.isRequired,
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
  displayNewNote: PropTypes.func,
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
  displayNewNote: null,
};

// Project Options Container
// create as stateful react component
export default function ProjectOptions({ projectOptions, project }, { ...props }) {
  const { currentUser } = useCurrentUser();
  if (Object.keys(projectOptions).length === 0) {
    return null;
  }

  function currentUserIsOnProject(user) {
    const projectUsers = project.users.map((projectUser) => projectUser.id);
    if (projectUsers.includes(user.id)) {
      return true;
    }
    return false;
  }

  function currentUserIsAdminOnProject(user) {
    const projectPermissions = project && project.permissions && project.permissions.find((p) => p.userId === user.id);
    return projectPermissions && projectPermissions.accessLevel === 30;
  }

  return (
    <PopoverWithButton
      buttonClass="project-options button-borderless button-small"
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="project-options-pop-btn"
    >
      {({ togglePopover }) => (
        <ProjectOptionsPop
          {...props}
          {...projectOptions}
          project={project}
          currentUser={currentUser}
          currentUserIsOnProject={currentUserIsOnProject(currentUser)}
          currentUserIsAdminOnProject={currentUserIsAdminOnProject(currentUser)}
          togglePopover={togglePopover}
        />
      )}
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
