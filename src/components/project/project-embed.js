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

  const BottomLeft = () => {
    if (isAuthorized) {
      return <EditButton name={project.id} isMember={isAuthorized} size="small" />;
    }
    return <ReportButton reportedType="project" reportedModel={project} />;
  };

  const BottomRight = () => (
    <>
      {currentUser.login && (
        <div className={styles.addToCollectionWrap}>
          <AddProjectToCollection project={project} currentUser={currentUser} addProjectToCollection={addProjectToCollection} fromProject />
        </div>
      )}
      <RemixButton name={project.domain} isMember={isAuthorized} onClick={trackRemix} />
    </>
  );
  
  useEffect(() => {
    console.log("project embed mounted")
  }, [])

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed domain={project.domain} />
      </div>
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
  isAuthorized: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
};

export default ProjectEmbed;
