import React from 'react';
import PropTypes from 'prop-types';

import FeaturedProjectOptionsPop from './pop-overs/featured-project-options-pop';
import { EditButton, RemixButton } from './includes/project-actions';
import Embed from './includes/embed';
import ReportButton from './pop-overs/report-abuse-pop';
import AddProjectToCollection from './includes/add-project-to-collection';
import { TrackClick } from './analytics';
import { useCurrentUser } from '../state/current-user';
import Heading from '../components/text/heading';

const EntityPageFeaturedProject = ({ isAuthorized, unfeatureProject, addProjectToCollection, featuredProject }) => {
  const currentUser = useCurrentUser();
  const reportBtn = (
    <div className="buttons buttons-left">
      <ReportButton className="button-small" reportedType="project" reportedModel={featuredProject} />
    </div>
  );

  const featuredTitle = (
    <>
      Featured Project
      <span className="emoji clapper emoji-in-title" />
    </>
  );

  return (
    <>
      <section id="featured-project-embed">
        <Heading tagName="h2">{featuredTitle}</Heading>

        {isAuthorized && <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />}
        <Embed domain={featuredProject.domain} />

        {isAuthorized ? (
          <div className="buttons buttons-left">
            <EditButton className="button-small button-edit" name={featuredProject.id} isMember={isAuthorized} />
          </div>
        ) : (
          reportBtn
        )}

        <div className="buttons buttons-right">
          {currentUser.login && (
            <AddProjectToCollection className="button-small" project={featuredProject} fromProject addProjectToCollection={addProjectToCollection} />
          )}

          <TrackClick
            name="Click Remix"
            properties={{
              baseProjectId: featuredProject.id,
              baseDomain: featuredProject.domain,
            }}
          >
            <RemixButton className="button-small" name={featuredProject.domain} isMember={isAuthorized} />
          </TrackClick>
        </div>
      </section>
    </>
  );
};

EntityPageFeaturedProject.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default EntityPageFeaturedProject;
