/* Used in project previews for collection-items */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import { FALLBACK_AVATAR_URL, getAvatarUrl } from 'Models/project';
import { ProjectLink } from '../../presenters/includes/link';
import ProjectOptionsPop from '../../presenters/pop-overs/project-options-pop';
import styles from './project-item.styl';

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getAvatarUrl(project.id)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
  });

const hasOptions = (projectOptions) => Object.keys(projectOptions).length > 0;

const ProjectItem = ({ project, projectOptions }) => (
  <div className={styles.container}>
    <ProjectLink className={getLinkBodyStyles(project)} project={project}>
      <div className={styles.projectHeader}>
        <span className={styles.avatarWrap}>
          <ProfileAvatar project={project} />
        </span>
        <Text>
          <span className={styles.projectDomain}>{project.domain}</span> {project.private && <PrivateIcon />}
        </Text>
      </div>
      <div className={styles.description}>
        <Markdown length={80}>{project.description || ' '}</Markdown>
      </div>
    </ProjectLink>
  </div>
);

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

export default ProjectItem;
