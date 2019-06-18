import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import ProfileList from 'Components/profile-list';
import VisibilityContainer from 'Components/visibility-container';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import { ProjectAvatar } from 'Components/images/avatar';
import { getLink } from 'Models/project';
import { useProjectMembers } from 'State/project';

import styles from './project-result-item.styl';

const ProfileListWithData = ({ project }) => {
  const { value: members } = useProjectMembers(project.id);
  return <ProfileList {...members} layout="row" size="small" />;
};

const ProfileListWrap = ({ project }) => (
  <div className={styles.profileListWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (
        wasEverVisible ? <ProfileListWithData project={project} /> : <ProfileList layout="row" size="small" />
      )}
    </VisibilityContainer>
  </div>
);

const ProjectResultItem = ({ project, selected, active, onClick }) => (
  <ResultItem
    className={classnames(project.private && styles.private)}
    href={getLink(project)}
    onClick={onClick}
    active={active}
    selected={selected}
  >
    <div>
      <ProjectAvatar project={project} />
    </div>
    <ResultInfo>
      <ResultName>{project.domain}</ResultName>
      {project.description.length > 0 && (
        <ResultDescription>
          <Markdown renderAsPlaintext>{project.description}</Markdown>
        </ResultDescription>
      )}
      <ProfileListWrap project={project} />
    </ResultInfo>
  </ResultItem>
);

ProjectResultItem.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectResultItem;
