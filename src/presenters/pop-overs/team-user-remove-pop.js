import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Loader from 'Components/loader';
import { getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import { useTrackedFunc } from '../segment-analytics';
import { NestedPopoverTitle } from './popover-nested';

const TeamUserRemoveButton = ({ user, removeUser }) => (
  <button className="button-small has-emoji" onClick={removeUser} type="button">
    Remove <img className="emoji avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={{ backgroundColor: user.color }} />
  </button>
);

const TeamUserProjectsToggle = ({ userTeamProjects, selectedProjects, setSelectedProjects }) => {
  function selectAllProjects() {
    const userTeamProjects = userTeamProjectsResponse.data || [];
    setSelectedProjects(new Set(userTeamProjects.map((p) => p.id)));
  }

  function unselectAllProjects() {
    setSelectedProjects(new Set());
  }

  function handleCheckboxChange({ target: { checked, value } }) {
    setSelectedProjects((nextSelectedProjects) => {
      nextSelectedProjects = new Set(nextSelectedProjects);
      if (checked) {
        nextSelectedProjects.add(value);
      } else {
        nextSelectedProjects.delete(value);
      }
      return nextSelectedProjects;
    });
  }
  return (
    <>
      <p className="action-description">Also remove them from these projects</p>
      <div className="projects-list">
        {userTeamProjects.map((project) => (
          <label key={project.id} htmlFor={`remove-user-project-${project.id}`}>
            <input
              className="checkbox-project"
              type="checkbox"
              id={`remove-user-project-${project.id}`}
              checked={this.state.selectedProjects.has(project.id)}
              value={project.id}
              onChange={this.handleCheckboxChange}
            />
            <img className="avatar" src={getProjectAvatarUrl(project.id)} alt="" />
            {project.domain}
          </label>
        ))}
      </div>
      {userTeamProjects.length > 1 && (
        <button className="button-small" type="button" onClick={allProjectsSelected ? unselectAllProjects : selectAllProjects}>
          {allProjectsSelected ? 'Unselect All' : 'Select All'}
        </button>
      )}
    </>
  );
};
function TeamUserRemovePop({ user, removeUser, userTeamProjects: userTeamProjectsResponse, togglePopover }) {
  const [selectedProjects, setSelectedProjects] = useState(new Set());

  const onRemoveUser = useTrackedFunc(() => {
    togglePopover();
    removeUser(Array.from(selectedProjects));
  }, 'Remove from Team submitted');

  const userTeamProjects = userTeamProjectsResponse.data || [];
  const allProjectsSelected = userTeamProjects.every((p) => selectedProjects.has(p.id));

  let projects = null;
  if (userTeamProjectsResponse.status === 'loading') {
    projects = <Loader />;
  } else if (userTeamProjects.length > 0) {
    projects = (
      <TeamUserProjectsToggle
        userTeamProjects={userTeamProjects}
        allProjectsSelected={allProjectsSelected}
        unselectAllProjects={unselectAllProjects}
        selectAllProjects={selectAllProjects}
      />
    );
  }

  return (
    <dialog className="pop-over team-user-info-pop team-user-remove-pop">
      <NestedPopoverTitle>Remove {getDisplayName(user)}</NestedPopoverTitle>

      {projects && (
        <section className="pop-over-actions" id="user-team-projects">
          {projects}
        </section>
      )}

      <section className="pop-over-actions danger-zone">
        <TeamUserRemoveButton user={user} removeUser={onRemoveUser} />
      </section>
    </dialog>
  );
}
TeamUserRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
    color: PropTypes.string,
  }).isRequired,
  userTeamProjects: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.array,
  }).isRequired,
  removeUser: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default TeamUserRemovePop;
