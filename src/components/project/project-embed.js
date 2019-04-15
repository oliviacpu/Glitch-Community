import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Embed from 'Components/project/embed';

import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/includes/add-project-to-collection';
import { useTracker } from '../../presenters/segment-analytics';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);

const ProjectEmbed = ({ project, topLeft, topRight, isAuthorized, currentUser, addProjectToCollection }) => {
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

  const BottomLeft = () => {
    if (isAuthorized) {
      return <EditButton name={project.id} isMember={isAuthorized} size="small" />;
    }
    return <ReportButton reportedType="project" reportedModel={project} />;
  };

  const BottomRight = () => (
    <>
      {
        currentUser.login && (
          <AddProjectToCollection
            project={project}
            currentUser={currentUser}
            addProjectToCollection={addProjectToCollection}
            fromProject
          />
        )
      }
      <RemixButton name={project.domain} isMember={isAuthorized} onClick={trackRemix} />
    </>
  );

  return (
    <section>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>{topLeft}</div>
        <div className={styles.right}>{topRight}</div>
      </div>
      <Embed domain={project.domain} />
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
          <BottomLeft />
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          <BottomRight />
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  topLeft: PropTypes.any,
  topRight: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  topLeft: null,
  topRight: null,
};

export default ProjectEmbed;
