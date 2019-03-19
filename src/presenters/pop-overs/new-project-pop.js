import React from 'react';
import PropTypes from 'prop-types';

import { TrackedExternalLink } from '../analytics';
import { Loader } from '../includes/loader';
import ProjectAvatar from '../includes/project-avatar';
import PopoverWithButton from './popover-with-button';

import { useAPI } from '../../state/api';
import { getRemixUrl } from '../../models/project';

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
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
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
    </section>
    <section className="pop-over-actions last-section pop-over-info">
      <button className="button-small button-tertiary button-on-secondary-background" onClick={importGitRepo} type="button">
        <span>Clone from Git Repo</span>
      </button>
    </section>
  </div>
);
NewProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

class NewProjectPopButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { projects: [] };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const projectIds = [
      'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
      'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
      '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    ];
    // always request against the production API, with no token
    const { data } = await this.props.api.get(`https://api.glitch.com/projects/byIds?ids=${projectIds.join(',')}`, {
      headers: {
        Authorization: '',
      },
    });
    this.setState({ projects: data });
  }

  render() {
    return (
      <PopoverWithButton buttonClass="button-small" dataTrack="open new-project pop" buttonText="New Project">
        <NewProjectPop projects={this.state.projects} />
      </PopoverWithButton>
    );
  }
}

NewProjectPopButton.propTypes = {
  api: PropTypes.any.isRequired,
};

export default (props) => {
  const api = useAPI();
  return <NewProjectPopButton {...props} api={api} />;
};
