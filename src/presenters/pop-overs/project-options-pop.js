import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';

import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
// import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

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

const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.children.length && (
        <PopoverActions key={i} type={group.type}>
          {group.children.map((item, j) => item.onClick && <PopoverMenuButton onClick={item.onClick} label={item.label} emoji={item.emoji} />)}
        </PopoverActions>
      ),
  );

const ProjectOptionsContent = ({ projectOptions, addToCollectionPopover, togglePopover }) => {
  projectOptions = mapValues(projectOptions, (action) => {
    togglePopover();
    action();
  });

  const onClickLeaveTeamProject = useTrackedFunc(projectOptions.leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(projectOptions.leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(() => (projectOptions.deleteProject), 'Delete Project clicked');

  const showPinOrFeatureSection = projectOptions.addPin || projectOptions.removePin || projectOptions.featureProject;
  const showDangerZone = projectOptions.removeProjectFromTeam || projectOptions.deleteProject || projectOptions.removeProjectFromCollection;

  return <PopoverMenuItems>
    {[
      { children: [
        { onClick: }
      ]}
    ]}
  </PopoverMenuItems>
  
  return (
    <PopoverDialog align="right">
      {showPinOrFeatureSection && (
        <PopoverActions>
          {projectOptions.featureProject && (
            <PopoverMenuButton onClick={() => (projectOptions.featureProject)} label="Feature" emoji="clapper" />
          )}
          {projectOptions.addPin && <PopoverMenuButton onClick={() => (projectOptions.addPin)} label="Pin " emoji="pushpin" />}
          {projectOptions.removePin && <PopoverMenuButton onClick={() => (projectOptions.removePin)} label="Un-Pin " emoji="pushpin" />}
        </PopoverActions>
      )}

      {projectOptions.displayNewNote && (
        <PopoverActions>
          <PopoverMenuButton onClick={() => (projectOptions.displayNewNote)} label="Add Note" emoji="spiralNotePad" />
        </PopoverActions>
      )}

      {projectOptions.addProjectToCollection && (
        <PopoverActions>
          <PopoverMenuButton onClick={addToCollectionPopover} label="Add to Collection " emoji="framedPicture" />
        </PopoverActions>
      )}

      {projectOptions.joinTeamProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={projectOptions.joinTeamProject} label="Join Project " emoji="rainbow" />
        </PopoverActions>
      )}

      {projectOptions.leaveTeamProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={onClickLeaveTeamProject} label="Leave Project " emoji="wave" />
        </PopoverActions>
      )}

      {projectOptions.leaveProject && (
        <PopoverActions>
          <PopoverMenuButton onClick={onClickLeaveProject} label="Leave Project " emoji="wave" />
        </PopoverActions>
      )}

      {showDangerZone && (
        <PopoverActions type="dangerZone">
          {projectOptions.removeProjectFromTeam && (
            <PopoverMenuButton onClick={() => (projectOptions.removeProjectFromTeam)} label="Remove Project " emoji="thumbsDown" />
          )}

          {projectOptions.deleteProject && <PopoverMenuButton onClick={onClickDeleteProject} label="Delete Project " emoji="bomb" />}

          {projectOptions.removeProjectFromCollection && (
            <PopoverMenuButton onClick={projectOptions.removeProjectFromCollection} label="Remove from Collection" emoji="thumbsDown" />
          )}
        </PopoverActions>
      )}
    </PopoverDialog>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const { currentUser } = useCurrentUser();
  projectOptions = determineProjectOptionsFunctions({ currentUser, project, projectOptions });
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
          }}
        >
          {({ addToCollection }) => (
            <ProjectOptionsContent projectOptions={projectOptions} addToCollectionPopover={addToCollection} togglePopover={togglePopover} />
          )}
        </MultiPopover>
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
