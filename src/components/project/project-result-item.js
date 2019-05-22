import React from 'react'
import PropTypes from 'prop-types'

import TransparentButton from 'Components/buttons/transparent-button'
import {ProjectAvatar} from 'Components/images/avatar';
import Markdown from 'COmponents/'

import styles from './project-result-item.styl';

const useMembers = createAPIHook(async (api, project) => {
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${project.id}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${project.id}`),
  ]);
  return { users, teams };
});

const ProjectResultItem = ({ project, onClick }) => {
  const { value: members } = useMembers(project);
  return (
    <div className={classnames(styles.projectResult, project.isPrivate && styles.private)}>
      <TransparentButton onClick={onClick}>
        <div className={styles.resultWrap}>
          <ProjectAvatar {...project} />
          <div className={styles.resultInfo}>
            <div className={styles.resultName}>{project.domain}</div>
            {project.description.length > 0 && (
              <div className={styles.resultDescription}>
                <Markdown renderAsPlaintext>{project.description}</Markdown>
              </div>
            )}
            <ProfileList {...members} layout="row" />
          </div>
        </div>
      </TransparentButton>
      <Button size="small" href={getProjectLink(project)}>
        View →
      </Button>
    </div>
  );
};