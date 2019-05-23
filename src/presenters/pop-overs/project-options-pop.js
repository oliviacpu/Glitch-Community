import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverInfo, PopoverActions, PopoverMenuButton } from 'Components/popover';

import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import PopoverWithButton from './popover-with-button';
import { NestedPopover } from './popover-nested';
import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

const isTeamProject = ({ currentUser, project }) => {
  for (const team of currentUser.teams) {
    if (project.teamIds.includes(team.id)) {
      return true;
    }
  }
  return false;
};

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
};

const determineProjectOptionsFunctions = ({ currentUser, project, projectOptions }) => {
  const isAnon = !(currentUser && currentUser.login);
  const projectUserIds = project && project.users && project.users.map((projectUser) => projectUser.id);
  const isProjectMember = currentUser && projectUserIds && projectUserIds.includes(currentUser.id);
  const currentUserProjectPermissions = currentUser && project && project.permissions && project.permissions.find((p) => p.userId === currentUser.id);
  const isProjectAdmin = currentUserProjectPermissions && currentUserProjectPermissions.accessLevel === 30;
  const {
    isAuthorized,
    featureProject,
    addPin,
    removePin,
    displayNewNote,
    addProjectToCollection,
    joinTeamProject,
    leaveTeamProject,
    leaveProject,
    removeProjectFromTeam,
    deleteProject,
    removeProjectFromCollection,
  } = projectOptions;

  return {
    featureProject: featureProject && !project.private && !isAnon && isAuthorized ? () => featureProject(project.id) : null,
    addPin: addPin && !isAnon && isAuthorized ? () => addPin(project.id) : null,
    removePin: removePin && !isAnon && isAuthorized ? () => removePin(project.id) : null,
    displayNewNote:
      !(project.note || project.isAddingANewNote) && displayNewNote && !isAnon && isAuthorized ? () => displayNewNote(project.id) : null,
    addProjectToCollection: addProjectToCollection && !isAnon ? addProjectToCollection : null,
    joinTeamProject: joinTeamProject && !isProjectMember && !isAnon && isAuthorized ? () => joinTeamProject(project.id, currentUser.id) : null,
    leaveTeamProject:
      leaveTeamProject && isProjectMember && !isAnon && !isProjectAdmin && isAuthorized ? () => leaveTeamProject(project.id, currentUser.id) : null,
    leaveProject:
      leaveProject && project.users.length > 1 && isProjectMember && !isProjectAdmin && isAuthorized
        ? (event) => promptThenLeaveProject({ event, project, leaveProject, currentUser })
        : null,
    removeProjectFromTeam:
      removeProjectFromTeam && !removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromTeam(project.id) : null,
    deleteProject: !removeProjectFromCollection && deleteProject && isProjectAdmin ? () => deleteProject(project.id) : null,
    removeProjectFromCollection: removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromCollection(project) : null,
  };
};

const ProjectOptionsContent = (props) => {
  function toggleAndCB(cb) {
    props.togglePopover();
    cb();
  }

  const onClickLeaveTeamProject = useTrackedFunc(props.leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(props.leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(() => toggleAndCB(props.deleteProject), 'Delete Project clicked');

  const showPinOrFeatureSection = props.addPin || props.removePin || props.featureProject;
  const showDangerZone = props.removeProjectFromTeam || props.deleteProject || props.removeProjectFromCollection;

  return (
    <PopoverDialog align="right">
      {showPinOrFeatureSection && (
        <PopoverActions>
          {props.featureProject && <PopoverMenuButton onClick={() => toggleAndCB(props.featureProject)} label="Feature" emoji="clapper" />}
          {props.addPin && <PopoverMenuButton onClick={() => toggleAndCB(props.addPin)} label="Pin " emoji="pushpin" />}
          {props.removePin && <PopoverMenuButton onClick={() => toggleAndCB(props.removePin)} label="Un-Pin " emoji="pushpin" />}
        </PopoverActions>
      )}

      {props.displayNewNote && (
        <PopoverActions>
          <PopoverMenuButton onClick={() => toggleAndCB(props.displayNewNote)} label="Add Note" emoji="spiralNotePad" />
        </PopoverActions>
      )}

      {props.addProjectToCollection && (
        <PopoverActions>
          <PopoverMenuButton onClick={props.addToCollectionPopover} label="Add to Collection " emoji="framedPicture" />
        </PopoverActions>
      )}

      {props.joinTeamProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={props.joinTeamProject} label="Join Project " emoji="rainbow" />
        </PopoverActions>
      )}

      {props.leaveTeamProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={onClickLeaveTeamProject} label="Leave Project " emoji="wave" />
        </PopoverActions>
      )}

      {props.leaveProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={onClickLeaveProject} label="Leave Project " emoji="wave" />
        </PopoverActions>
      )}

      {showDangerZone && (
        <PopoverActions type="dangerZone">
          {props.removeProjectFromTeam && (
            <PopoverMenuButton onClick={() => toggleAndCB(props.removeProjectFromTeam)} label="Remove Project " emoji="thumbsDown" />
          )}

          {props.deleteProject && <PopoverMenuButton onClick={onClickDeleteProject} label="Delete Project " emoji="bomb" />}

          {props.removeProjectFromCollection && (
            <PopoverMenuButton onClick={props.removeProjectFromCollection} label="Remove from Collection" emoji="thumbsDown" />
          )}
        </PopoverActions>
      )}
    </PopoverDialog>
  );
};

ProjectOptionsContent.propTypes = {
  addPin: PropTypes.func,
  addProjectToCollection: PropTypes.func,
  deleteProject: PropTypes.func,
  displayNewNote: PropTypes.func,
  featureProject: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
  removePin: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  togglePopover: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};
ProjectOptionsContent.defaultProps = {
  addPin: null,
  addProjectToCollection: null,
  deleteProject: null,
  displayNewNote: null,
  featureProject: null,
  joinTeamProject: null,
  leaveProject: null,
  leaveTeamProject: null,
  removePin: null,
  removeProjectFromTeam: null,
};

export default function ProjectOptionsPop(props) {
  const { currentUser } = useCurrentUser();
  const projectOptions = determineProjectOptionsFunctions({ currentUser, ...props });
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) {
    return null;
  }

  return (
    <PopoverMenu>
      {({ togglePopover }) => (
        <MultiPopover
          views={{ 
            addToCollection: () => <div>TODO</div>,
            createCollection: () => <div>TODO</div>,
          }}>
          {(showView) => (
            <ProjectOptionsContent
              {...props}
              {...projectOptions}
              addToCollectionPopover={addToCollectionPopover}
              togglePopover={togglePopover}
            
            />
          )}
        </MultiPopover>
        
        
        <NestedPopover
          alternateContent={() => (
            <AddProjectToCollectionBase
              {...props}
              {...projectOptions}
              togglePopover={togglePopover}
              currentUser={currentUser}
            />
          )}
        >
          {(addToCollectionPopover) => (
            
          )}
        </NestedPopover>
      )}
    </PopoverMenu>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.object.isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
