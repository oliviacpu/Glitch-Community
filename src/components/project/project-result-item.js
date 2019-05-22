import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import ProfileList from 'Components/profile-list';
import VisibilityContainer from 'Components/visibility-container';
import { getLink } from 'Models/project';
import { createAPIHook } from 'State/api';
import { getAllPages } from 'Shared/api';

import ProjectAvatar from '../../presenters/includes/project-avatar';
import styles from './project-result-item.styl';

const ProjectResultItemBase = ({ project, active, onClick, teams, users }) => {
  const ref = useRef();
  useEffect(() => {
    if (active && ref.current.scrollIntoView) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);
  return (
    <div ref={ref} className={classnames(styles.projectResult, project.isPrivate && styles.private, active && styles.active)}>
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
            <div className={styles.profileListWrap}>
              <ProfileList teams={teams} users={users} layout="row" size="small" />
            </div>
          </div>
        </div>
      </TransparentButton>
      <div className={styles.linkButtonWrap}>
        <Button size="small" href={getLink(project)}>
          View →
        </Button>
      </div>
    </div>
  );
};

const useMembers = createAPIHook(async (api, project) => {
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${project.id}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${project.id}`),
  ]);
  return { users, teams };
});

const ProjectResultWithData = (props) => {
  const { value: members } = useMembers(props.project);
  return <ProjectResultItemBase {...props} {...members} />;
};

const ProjectResultItem = (props) => {
  // IntersectionObserver behaves strangely with element.scrollIntoView, so we'll assume if something is active it is also visible.
  const [wasEverActive, setWasEverActive] = useState(false);
  useEffect(() => {
    if (props.active) setWasEverActive(true);
  }, [props.active]);
  return (
    <VisibilityContainer>
      {({ wasEverVisible }) => (wasEverVisible || wasEverActive ? <ProjectResultWithData {...props} /> : <ProjectResultItemBase {...props} />)}
    </VisibilityContainer>
  );
};
ProjectResultItem.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectResultItem;
