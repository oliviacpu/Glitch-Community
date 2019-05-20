import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { pickBy } from 'lodash';
import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import ProfileList from 'Components/profile-list';
import { ProjectLink } from 'Components/link';
import AnimationContainer from 'Components/animation-container';
import { FALLBACK_AVATAR_URL, getAvatarUrl } from 'Models/project';
import ProjectOptionsPop from '../../presenters/pop-overs/project-options-pop';
import { createAPIHook } from '../../state/api';
import styles from './project-item.styl';

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getAvatarUrl(project.id)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
  });

const hasOptions = (projectOptions) => Object.keys(projectOptions).length > 0;

const useUsers = createAPIHook(async (api, userIDs) => {
  if (!userIDs.length) {
    return undefined;
  }
  const idString = userIDs.map((id) => `id=${id}`).join('&');

  const { data } = await api.get(`/v1/users/by/id/?${idString}`);
  return Object.values(data);
});

const useTeams = createAPIHook(async (api, teamIDs) => {
  if (!teamIDs.length) {
    return undefined;
  }
  const idString = teamIDs.map((id) => `id=${id}`).join('&');

  const { data } = await api.get(`/v1/teams/by/id/?${idString}`);
  return Object.values(data);
});

const ProjectItem = ({ project, projectOptions }) => {
  const dispatch = (projectOptionName, ...args) => projectOptions[projectOptionName](...args);

  return (
    <AnimationContainer type="slideDown" onAnimationEnd={dispatch}>
      {(slideDown) => (
        <AnimationContainer type="slideUp" onAnimationEnd={dispatch}>
          {(slideUp) => {
            const animatedProjectOptions = pickBy(
              {
                ...projectOptions,
                addPin: (id) => slideUp('addPin', id),
                removePin: (id) => slideDown('removePin', id),
                deleteProject: (id) => slideDown('deleteProject', id),
                removeProjectFromTeam: (id) => slideDown('removeProjectFromTeam', id),
                featureProject: (id) => slideUp('featureProject', id),
              },
              (_, key) => projectOptions[key],
            );

            return (
              <div className={styles.container}>
                <header className={styles.header}>
                  <div className={classnames(styles.userListContainer, { [styles.spaceForOptions]: hasOptions(projectOptions) })}>
                    <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} users={project.users} teams={project.teams} />
                  </div>
                  <div className={styles.projectOptionsContainer}>
                    <ProjectOptionsPop project={project} projectOptions={animatedProjectOptions} />
                  </div>
                </header>
                <ProjectLink className={getLinkBodyStyles(project)} project={project}>
                  <div className={styles.projectHeader}>
                    <div className={styles.avatarWrap}>
                      <ProfileAvatar project={project} />
                    </div>
                    <div className={styles.nameWrap}>
                      <div className={styles.itemButtonWrap}>
                        <Button decorative>
                          {project.private && <PrivateIcon />} <span className={styles.projectDomain}>{project.domain}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.description}>
                    <Markdown length={80}>{project.description || ' '}</Markdown>
                  </div>
                </ProjectLink>
              </div>
            );
          }}
        </AnimationContainer>
      )}
    </AnimationContainer>
  );
};
ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  projectOptions: {},
};

function ProjectWithDataLoading({ project, ...props }) {
  const { value: users } = useUsers(project.userIDs);
  const { value: teams } = useTeams(project.teamIDs);
  const projectWithData = { ...project, users, teams };
  return <ProjectItem project={projectWithData} {...props} />;
}

export default ({ fetchMembers, ...props }) => (fetchMembers ? <ProjectWithDataLoading {...props} /> : <ProjectItem {...props} />);
