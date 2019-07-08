import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import Button from 'Components/buttons/button';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton, ActionDescription } from 'Components/popover';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

const isTeamProject = ({ currentUser, project }) => currentUser.teams.some((team) => project.teamIds.includes(team.id));

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.some((item) => item.onClick) && (
        <PopoverActions key={i} type={group.some((item) => item.dangerZone) ? 'dangerZone' : undefined}>
          {group.map((item, j) => item.onClick && <PopoverMenuButton key={j} onClick={item.onClick} label={item.label} emoji={item.emoji} />)}
        </PopoverActions>
      ),
  );

const LeaveProjectPopover = ({ project, leaveProject }) => {
  const { currentUser } = useCurrentUser();
  if (isTeamProject({ currentUser, project })) {
    useTrackedFunc(leaveProject(project), 'Leave Project clicked (team)');
    return null;
  }
  return (
    <PopoverDialog wide focusOnDialog align="right">
      <PopoverActions>
        <ActionDescription>
        Once you leave this project, you'll lose access to it unless someone else invites you back.

        Are you sure you want to leave {project.domain}?
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <Button>
          Leave Project
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
};

const ProjectOptionsContent = ({ projectOptions, addToCollectionPopover, leaveProjectPopover }) => {
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');

  return (
    <PopoverDialog align="right">
      <PopoverMenuItems>
        {[
          [
            { onClick: projectOptions.featureProject, label: 'Feature', emoji: 'clapper' },
            { onClick: projectOptions.addPin, label: 'Pin', emoji: 'pushpin' },
            { onClick: projectOptions.removePin, label: 'Un-Pin', emoji: 'pushpin' },
          ],
          [{ onClick: projectOptions.displayNewNote, label: 'Add Note', emoji: 'spiralNotePad' }],
          [{ onClick: addToCollectionPopover, label: 'Add to Collection', emoji: 'framedPicture' }],
          [{ onClick: projectOptions.joinTeamProject, label: 'Join Project', emoji: 'rainbow' }],
          [
            { onClick: leaveProjectPopover, label: 'Leave Project', emoji: 'wave' },
          ],
          [
            { onClick: projectOptions.removeProjectFromTeam, label: 'Remove Project', emoji: 'thumbsDown', dangerZone: true },
            { onClick: onClickDeleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
            { onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
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
    <PopoverMenu>
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
            leaveProject: () => <LeaveProjectPopover project={project} leaveProject={projectOptions.leaveProject} />,
          }}
        >
          {({ addToCollection, leaveProject }) => (
            <ProjectOptionsContent
              projectOptions={toggleBeforeAction(togglePopover)}
              addToCollectionPopover={addToCollection}
              leaveProjectPopover={leaveProject}
            />
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
