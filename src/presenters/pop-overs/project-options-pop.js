import React from 'react';
import PropTypes from 'prop-types';

import { useTrackedFunc } from '../segment-analytics';
import PopoverWithButton from './popover-with-button';
import { NestedPopover } from './popover-nested';
import { useCurrentUser } from '../../state/current-user';

import AddProjectToCollectionPop from './add-project-to-collection-pop';

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

const determineProjectOptions = ({ currentUser, project, projectOptions }) => {
  const isAnon = !(currentUser && currentUser.login);
  const currentUserIsOnProject = currentUser && project.users.map((projectUser) => projectUser.id).includes(currentUser.id);
  const currentUserPermissions = currentUser && project && project.permissions && project.permissions.find((p) => p.userId === currentUser.id)
  const currentUserIsAdminOnProject = currentUserPermissions && currentUserPermissions.accessLevel === 30;

  return {
    featureProject: projectOptions.featureProject && !project.private && !isAnon ? () => projectOptions.featureProject(project.id) : null,
    addPin: projectOptions.addPin && !isAnon ? () => projectOptions.addPin(project.id) : null,
    removePin: projectOptions.removePin && !isAnon ? () => projectOptions.removePin(project.id) : null,
    addNote: !(project.note || project.isAddingANewNote) && projectOptions.displayNewNote && !isAnon ? () => projectOptions.displayNewNote(project.id) : null,
    addProjectToCollection: projectOptions.addProjectToCollection && !isAnon ? projectOptions.addProjectToCollection : null, 
    joinTeamProject: projectOptions.joinTeamProject && !currentUserIsOnProject && !isAnon ? () => projectOptions.joinTeamProject(project.id, currentUser.id) : null,
    leaveTeamProject: projectOptions.leaveTeamProject && currentUserIsOnProject && !isAnon ? () => projectOptions.leaveTeamProject(project.id, currentUser.id) : null,
    leaveProject: projectOptions.leaveProject && project.users.length > 1 && currentUserIsOnProject ? (event) => promptThenLeaveProject({ 
      event,
      project: project, 
      leaveProject: projectOptions.leaveProject, 
      currentUser,
    }) : null,
    removeProjectFromTeam: projectOptions.removeProjectFromTeam && !projectOptions.removeProjectFromCollection && !isAnon ? () => projectOptions.removeProjectFromTeam(project.id) : null,
    deleteProject: currentUserIsAdminOnProject && !projectOptions.removeProjectFromCollection && projectOptions.deleteProject ? () => projectOptions.deleteProject(project.id) : null,
    removeProjectFromCollection: projectOptions.removeProjectFromCollection && !isAnon ? () => projectOptions.removeProjectFromCollection(project) : null,
  }
}

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
// ProjectOptionsPop.propTypes = {
//   // currentUser: PropTypes.object.isRequired,
//   // project: PropTypes.shape({
//   //   users: PropTypes.array.isRequired,
//   // }).isRequired,
//   // togglePopover: PropTypes.func.isRequired,
//   // addPin: PropTypes.func,
//   // removePin: PropTypes.func,
//   // deleteProject: PropTypes.func,
//   // leaveProject: PropTypes.func,
//   // removeProjectFromTeam: PropTypes.func,
//   // joinTeamProject: PropTypes.func,
//   // leaveTeamProject: PropTypes.func,
//   // featureProject: PropTypes.func,
//   // currentUserIsOnProject: PropTypes.bool,
//   // displayNewNote: PropTypes.func,
// };
// ProjectOptionsPop.defaultProps = {
//   // currentUserIsOnProject: false,
//   // addPin: null,
//   // removePin: null,
//   // deleteProject: null,
//   // leaveProject: null,
//   // removeProjectFromTeam: null,
//   // joinTeamProject: null,
//   // leaveTeamProject: null,
//   // featureProject: null,
//   // displayNewNote: null,
// };

export default function ProjectOptions(props) {
  const { currentUser } = useCurrentUser();
  const projectOptions = determineProjectOptions({ currentUser, project: props.project, projectOptions: props.projectOptions });

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
        <NestedPopover alternateContent={() => <AddProjectToCollectionPop {...props} togglePopover={togglePopover} />}>
          {(addToCollectionPopover) => (
            <ProjectOptionsContent 
              {...props} 
              {...projectOptions}
              addToCollectionPopover={addToCollectionPopover}
              togglePopover={togglePopover} 
            />
          )}
        </NestedPopover>
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
