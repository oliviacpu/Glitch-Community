import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'Components/loader';
import Button from 'Components/buttons/button';
import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverActions } from 'Components/popover';
import { getRemixUrl } from 'Models/project';
import { useTracker, TrackedExternalLink } from '../segment-analytics';
import ProjectAvatar from '../includes/project-avatar';

import { createAPIHook } from '../../state/api';

const importGitRepo = () => {
  /* eslint-disable no-alert */
  const repoUrl = window.prompt('Paste the full URL of your repository', 'https://github.com/orgname/reponame.git');
  /* eslint-enable no-alert */
  if (!repoUrl) {
    return;
  }
  window.location.href = `/edit/#!/import/git?url=${repoUrl}`;
};

const NewProjectResultItem = ({ id, domain, description }) => (
  <div className="result result-project">
    <ProjectAvatar domain={domain} id={id} />
    <div className="results-info">
      <div className="result-name" title={domain}>
        {domain}
      </div>
      {description.length > 0 && <div className="result-description">{description}</div>}
    </div>
  </div>
);

const NewProjectPop = ({ projects }) => (
  <PopoverDialog className="new-project-pop" align="right">
    <PopoverSection className="results-list">
      <div className="results">
        {projects.length ? (
          projects.map((project) => (
            <TrackedExternalLink
              key={project.id}
              to={getRemixUrl(project.domain)}
              name="New Project Clicked"
              properties={{
                baseDomain: project.domain,
                origin: 'community new project pop',
              }}
            >
              <NewProjectResultItem {...project} />
            </TrackedExternalLink>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </PopoverSection>
    <PopoverActions type="secondary">
      <Button size="small" type="tertiary" onClick={importGitRepo} matchBackground>
        Clone from Git Repo
      </Button>
    </PopoverActions>
  </PopoverDialog>
);
NewProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const useNewProjectAPI = createAPIHook(async (api) => {
  const projectIds = [
    'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
    'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
    '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
  ];
  // always request against the production API, with no token
  const { data } = await api.get(`https://api.glitch.com/projects/byIds?ids=${projectIds.join(',')}`, {
    headers: {
      Authorization: '',
    },
  });
  return data;
});

function NewProjectPopButton() {
  const { value } = useNewProjectAPI();
  const projects = value || [];
  const onOpen = useTracker('open new-project pop');

  return (
    <div style={{ position: 'relative' }}>
      <PopoverWithButton onOpen={onOpen} buttonProps={{ size: 'small' }} buttonText="New Project">
        {() => <NewProjectPop projects={projects} />}
      </PopoverWithButton>
    </div>
  );
}

export default NewProjectPopButton;
