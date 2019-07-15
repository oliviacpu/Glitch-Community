import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

const isTeamProject = ({ currentUser, project }) => currentUser.teams.some((team) => project.teamIds.includes(team.id));

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.some((item) => item.visible) && (
        <PopoverActions key={i} type={group.some((item) => item.dangerZone) ? 'dangerZone' : undefined}>
          {group.map((item, j) => item.onClick && <PopoverMenuButton key={j} onClick={item.onClick} label={item.label} emoji={item.emoji} />)}
        </PopoverActions>
      ),
  );

const ProjectOptionsContent = ({ project, projectOptions, addToCollectionPopover }) => {
  const { currentUser } = useCurrentUser();
  // TODO: replace this with a multi-popover pane
  const onClickLeaveProject = useTrackedFunc(projectOptions.leaveProject && (() => {
    if (isTeamProject({ currentUser, project })) {
      projectOptions.leaveProject(project);
      return;
    }

    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${
      project.domain
    }?`;
    if (window.confirm(prompt)) {
      projectOptions.leaveProject(project);
    }
  }), 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');

  return (
    <PopoverDialog align="right">
      <PopoverMenuItems>
        {[
          [
            { visible: projectOptions.featureProject, onClick: projectOptions.featureProject, label: 'Feature', emoji: 'clapper' },
            { visible: projectOptions.addPin, onClick: projectOptions.addPin, label: 'Pin', emoji: 'pushpin' },
            { visible: projectOptions.removePin, onClick: projectOptions.removePin, label: 'Un-Pin', emoji: 'pushpin' },
          ],
          [{ visible: projectOptions.displayNewNote, onClick: projectOptions.displayNewNote, label: 'Add Note', emoji: 'spiralNotePad' }],
          [{ visible: projectOptions.addProjectToCollection, onClick: addToCollectionPopover, label: 'Add to Collection', emoji: 'framedPicture' }],
          [{ visible: projectOptions.joinTeamProject, onClick: projectOptions.joinTeamProject, label: 'Join Project', emoji: 'rainbow' }],
          [
<<<<<<< HEAD
            { visible: projectOptions.leaveProject, onClick: leaveProjectPopover, label: 'Leave Project', emoji: 'wave' },
=======
            { onClick: onClickLeaveProject, label: 'Leave Project', emoji: 'wave' },
>>>>>>> 1f5fd20e9e433dca7d647b90cca1c1cb9d9cd083
          ],
          [
            { visible: projectOptions.removeProjectFromTeam, onClick: projectOptions.removeProjectFromTeam, label: 'Remove Project', emoji: 'thumbsDown', dangerZone: true },
            { visible: projectOptions.deleteProject, onClick: onClickDeleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
            { visible: projectOptions.removeProjectFromCollection, onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
          ],
        ]}
      </PopoverMenuItems>
    </PopoverDialog>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) return null;

  const toggleBeforeAction = (togglePopover) =>
    mapValues(
      projectOptions,
      (action) =>
        action &&
        ((...args) => {
          togglePopover();
          action(...args);
        }),
    );

  return (
    <PopoverMenu label={`Project Options for ${project.domain}`}>
      {({ togglePopover }) => (
        <MultiPopover
          views={{
            addToCollection: ({ createCollection }) => (
              <AddProjectToCollectionBase
                fromProject
                project={project}
                togglePopover={togglePopover}
                addProjectToCollection={projectOptions.addProjectToCollection}
                createCollectionPopover={createCollection}
              />
            ),
            createCollection: () => <CreateCollectionWithProject project={project} addProjectToCollection={projectOptions.addProjectToCollection} />,
          }}
        >
<<<<<<< HEAD
          {({ addToCollection, leaveProject }) => (
            <ProjectOptionsContent
              projectOptions={toggleBeforeAction(togglePopover)}
              addToCollectionPopover={addToCollection}
              leaveProjectPopover={leaveProject}
            />
=======
          {({ addToCollection }) => (
            <ProjectOptionsContent project={project} projectOptions={toggleBeforeAction(togglePopover)} addToCollectionPopover={addToCollection} />
>>>>>>> 1f5fd20e9e433dca7d647b90cca1c1cb9d9cd083
          )}
        </MultiPopover>
      )}
    </PopoverMenu>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    permissions: PropTypes.array.isRequired,
    teamIds: PropTypes.array.isRequired,
    private: PropTypes.bool,
    note: PropTypes.any,
    isAddingNewNote: PropTypes.bool,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
