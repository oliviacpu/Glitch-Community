import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { EditButton, RemixButton } from 'Components/project/project-actions';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);

const ProjectEmbed = ({ project, top, isAuthorized, addProjectToCollection }) => {
  const { currentUser } = useCurrentUser();
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

  const isMember = currentUser.projects.some(({ id }) => id === project.id);
  const bottomLeft = isMember ? (
    <EditButton name={project.id} isMember={isMember} size="small" />
  ) : (
    <ReportButton reportedType="project" reportedModel={project} />
  );

  const bottomRight = (
    <>
      {currentUser.login && (
        <div className={styles.addToCollectionWrap}>
          <AddProjectToCollection project={project} currentUser={currentUser} addProjectToCollection={addProjectToCollection} fromProject />
        </div>
      )}
      <RemixButton name={project.domain} isMember={isAuthorized} onClick={trackRemix} />
    </>
  );

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed domain={project.domain} />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
          {bottomLeft}
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          {bottomRight}
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
};

export default ProjectEmbed;
