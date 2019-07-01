import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { EditButton, RemixButton } from 'Components/project/project-actions';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useProjectOptions } from 'State/project-options';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);

const ProjectEmbed = ({ project, top, addProjectToCollection }) => {
  const projectOptions = useProjectOptions(project, addProjectToCollection ? { addProjectToCollection } : {});
  const { currentUser } = useCurrentUser();
  const isMember = currentUser.projects.some(({ id }) => id === project.id);
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

<<<<<<< HEAD
=======
  const bottomLeft = isMember ? (
    <EditButton name={project.id} isMember={isMember} size="small" />
  ) : (
    <ReportButton reportedType="project" reportedModel={project} />
  );

  const bottomRight = (
    <>
      {projectOptions.addProjectToCollection && (
        <div className={styles.addToCollectionWrap}>
          <AddProjectToCollection project={project} addProjectToCollection={projectOptions.addProjectToCollection} fromProject />
        </div>
      )}
      <RemixButton name={project.domain} isMember={isMember} onClick={trackRemix} />
    </>
  );

>>>>>>> dd1cdd190d3c99e7bc2da5fd8da3e7d42c98ecc4
  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed domain={project.domain} />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
<<<<<<< HEAD
          {(isAuthorized) ? <EditButton name={project.id} isMember={isAuthorized} size="small" /> : <ReportButton reportedType="project" reportedModel={project} /> }
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          {currentUser.login && (
            <div className={styles.addToCollectionWrap}>
              <AddProjectToCollection project={project} currentUser={currentUser} addProjectToCollection={addProjectToCollection} fromProject />
            </div>
          )}
          <RemixButton name={project.domain} isMember={isAuthorized} onClick={trackRemix} />
=======
          {bottomLeft}
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          {bottomRight}
>>>>>>> dd1cdd190d3c99e7bc2da5fd8da3e7d42c98ecc4
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
};

export default ProjectEmbed;
