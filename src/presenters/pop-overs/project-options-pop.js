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

const ProjectOptionsContent = (props) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, { once: true });
    projectContainer.classList.add(className);
    props.togglePopover();
  }

  function toggleAndCB(cb) {
    props.togglePopover();
    cb();
  }

  const onClickLeaveTeamProject = useTrackedFunc(props.leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(props.leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc((e) => animate(e, 'slide-down', props.deleteProject), 'Delete Project clicked');

  const showPinOrFeatureSection = props.addPin || props.removePin || props.featureProject;
  const showDangerZone = props.removeProjectFromTeam || props.deleteProject || props.removeProjectFromCollection;

  return (
    <dialog className="pop-over project-options-pop">

      {showPinOrFeatureSection && (
        <section className="pop-over-actions">
          {props.featureProject && (
            <PopoverButton onClick={(e) => animate(e, 'slide-up', props.featureProject)} text="Feature" emoji="clapper" />
          )}
          {props.addPin && (
            <PopoverButton onClick={(e) => animate(e, 'slide-up', props.addPin)} text="Pin " emoji="pushpin" />
          )}
          {props.removePin && (
            <PopoverButton onClick={(e) => animate(e, 'slide-down', props.removePin)} text="Un-Pin " emoji="pushpin" />
          )}
        </section>
      )}

      {props.addNote && (
        <section className="pop-over-actions">
          <PopoverButton onClick={() => toggleAndCB(props.addNote)} text="Add Note" emoji="spiral_note_pad" />
        </section>
      )}

      {props.addProjectToCollection && (
        <section className="pop-over-actions">
          <PopoverButton onClick={props.addToCollectionPopover} text="Add to Collection " emoji="framed-picture" />
        </section>
      )}

      {props.joinTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={props.joinTeamProject} text="Join Project " emoji="rainbow" />
        </section>
      )}

      {props.leaveTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveTeamProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {props.leaveProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {showDangerZone && (
        <section className="pop-over-actions danger-zone last-section">
          {props.removeProjectFromTeam && (
            <PopoverButton onClick={(e) => animate(e, 'slide-down', props.removeProjectFromTeam)} text="Remove Project " emoji="thumbs_down" />
          )}

          {props.deleteProject && (
            <PopoverButton onClick={onClickDeleteProject} text="Delete Project " emoji="bomb" />
          )}

          {props.removeProjectFromCollection && (
            <PopoverButton onClick={props.removeProjectFromCollection} text="Remove from Collection" emoji="thumbs_down" />
          )}
        </section>
      )}
      
    </dialog>
  );
};
ProjectOptionsPop.propTypes = {
  // currentUser: PropTypes.object.isRequired,
  // project: PropTypes.shape({
  //   users: PropTypes.array.isRequired,
  // }).isRequired,
  // togglePopover: PropTypes.func.isRequired,
  // addPin: PropTypes.func,
  // removePin: PropTypes.func,
  // deleteProject: PropTypes.func,
  // leaveProject: PropTypes.func,
  // removeProjectFromTeam: PropTypes.func,
  // joinTeamProject: PropTypes.func,
  // leaveTeamProject: PropTypes.func,
  // featureProject: PropTypes.func,
  // currentUserIsOnProject: PropTypes.bool,
  // displayNewNote: PropTypes.func,
};
ProjectOptionsPop.defaultProps = {
  // currentUserIsOnProject: false,
  // addPin: null,
  // removePin: null,
  // deleteProject: null,
  // leaveProject: null,
  // removeProjectFromTeam: null,
  // joinTeamProject: null,
  // leaveTeamProject: null,
  // featureProject: null,
  // displayNewNote: null,
};



const isTeamProject = ({ currentUser, project }) => {
  for (const team of currentUser.teams) {
    if (project.teamIds.includes(team.id)) {
      return true;
    }
  }
  return false;
}

const promptThenLeaveProject = ({ event, project, leaveProject, currentUser }) => {
  if (isTeamProject({ currentUser, project })) {
    leaveProject(project.id, event);
    return;
  }

  const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${
    project.domain
  }?`;
  if (window.confirm(prompt)) {
    leaveProject(project.id, event);
  }
}

const determineProjectOptions = (props, currentUser) => {
  const isAnon = !(currentUser && currentUser.login);
  const currentUserIsOnProject = currentUser && props.project.users.map((projectUser) => projectUser.id).includes(currentUser.id);
  const currentUserPermissions = currentUser && props.project && props.project.permissions && props.project.permissions.find((p) => p.userId === currentUser.id)
  const currentUserIsAdminOnProject = currentUserPermissions && currentUserPermissions.accessLevel === 30;

  return {
    featureProject: props.projectOptions.featureProject && !props.project.private && !isAnon ? () => props.projectOptions.featureProject(props.project.id) : null,
    addPin: props.projectOptions.addPin && !isAnon ? () => props.projectOptions.addPin(props.project.id) : null,
    removePin: props.projectOptions.removePin && !isAnon ? () => props.projectOptions.removePin(props.project.id) : null,
    addNote: !(props.project.note || props.project.isAddingANewNote) && props.projectOptions.displayNewNote && !isAnon ? () => props.projectOptions.displayNewNote(props.project.id) : null,
    addProjectToCollection: props.projectOptions.addProjectToCollection && !isAnon ? props.projectOptions.addProjectToCollection : null, 
    joinTeamProject: props.projectOptions.joinTeamProject && !currentUserIsOnProject && !isAnon ? () => props.projectOptions.joinTeamProject(props.project.id, currentUser.id) : null,
    leaveTeamProject: props.projectOptions.leaveTeamProject && currentUserIsOnProject && !isAnon ? () => props.projectOptions.leaveTeamProject(props.project.id, currentUser.id) : null,
    leaveProject: props.projectOptions.leaveProject && props.project.users.length > 1 && currentUserIsOnProject ? (event) => promptThenLeaveProject({ 
      event,
      project: props.project, 
      leaveProject: props.projectOptions.leaveProject, 
      currentUser,
    }) : null,
    removeProjectFromTeam: props.projectOptions.removeProjectFromTeam && !props.projectOptions.removeProjectFromCollection && !isAnon ? () => props.projectOptions.removeProjectFromTeam(props.project.id) : null,
    deleteProject: currentUserIsAdminOnProject && !props.projectOptions.removeProjectFromCollection && props.projectOptions.deleteProject ? () => props.projectOptions.deleteProject(props.project.id) : null,
    removeProjectFromCollection: props.projectOptions.removeProjectFromCollection && !isAnon ? () => props.projectOptions.removeProjectFromCollection(props.project) : null,
  }
}

const ProjectOptionsPop = ({ ...props }) => (
  <NestedPopover alternateContent={() => <AddProjectToCollectionPop {...props} togglePopover={props.togglePopover} />}>
    {(addToCollectionPopover) => <ProjectOptionsContent {...props} addToCollectionPopover={addToCollectionPopover} />}
  </NestedPopover>
);

export default function ProjectOptions(props) {
  const { currentUser } = useCurrentUser();

  const projectOptions = determineProjectOptions(props, currentUser);

  const noProjectOptions = Object.values(projectOptions).every(option => !option);
  if (noProjectOptions) {
    return null;
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
