import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout';

import {useCurrentUser} from '../../state/current-user';
import {useAPI} from '../../state/api';

import useErrorHandlers from '../error-handlers';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';
import ProjectsList from '../projects-list';
import TeamItem from '../team-item';
import UserItem from '../user-item';

import Heading from '../../components/text/heading';

const TeamResults = ({ teams }) => (
  <article>
    <Heading tagName="h2">Teams</Heading>
    <ul className="teams-container">
      {teams ? (
        teams.map((team) => (
          <li key={team.id}>
            <TeamItem team={team} />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  </article>
);

const UserResults = ({ users }) => (
  <article>
    <Heading tagName="h2">Users</Heading>
    <ul className="users-container">
      {users ? (
        users.map((user) => (
          <li key={user.id}>
            <UserItem user={user} />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  </article>
);

const ProjectResults = ({ addProjectToCollection, api, projects }) => {
  const currentUser = useCurrentUser()
  if (!projects) {
    return (
      <article>
        <Heading tagName="h2">Projects</Heading>
        <Loader />
      </article>
    );
  }
  const loggedInUserWithProjects = projects && currentUser.login;
  return loggedInUserWithProjects ? (
    <ProjectsList title="Projects" projects={projects} api={api} projectOptions={{ addProjectToCollection }} />
  ) : (
    <ProjectsList title="Projects" projects={projects} api={api} />
  );
};

const MAX_RESULTS = 20;
const showResults = (results) => !results || !!results.length;

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      users: null,
      projects: null,
    };
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }

  componentDidMount() {
    const { handleError } = this.props;
    this.searchTeams().catch(handleError);
    this.searchUsers().catch(handleError);
    this.searchProjects().catch(handleError);
  }

  async searchTeams() {
    const { api, query } = this.props;
    const { data } = await api.get(`teams/search?q=${query}`);
    this.setState({
      teams: data.slice(0, MAX_RESULTS),
    });
  }

  async searchUsers() {
    const { api, query } = this.props;
    const { data } = await api.get(`users/search?q=${query}`);
    this.setState({
      users: data.slice(0, MAX_RESULTS),
    });
  }

  async searchProjects() {
    const { api, query } = this.props;
    const { data } = await api.get(`projects/search?q=${query}`);
    this.setState({
      projects: data.filter((project) => !project.notSafeForKids).slice(0, MAX_RESULTS),
    });
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  render() {
    const { teams, users, projects } = this.state;
    const noResults = [teams, users, projects].every((results) => !showResults(results));
    return (
      <main className="search-results">
        {showResults(teams) && <TeamResults teams={teams} />}
        {showResults(users) && <UserResults users={users} />}
        {showResults(projects) && (
          <ProjectResults
            projects={projects}
            api={this.props.api}
            addProjectToCollection={this.addProjectToCollection}
          />
        )}
        {noResults && <NotFound name="any results" />}
      </main>
    );
  }
}
SearchResults.propTypes = {
  api: PropTypes.any,
  query: PropTypes.string.isRequired,
};

SearchResults.defaultProps = {
  api: null,
};

const SearchPage = ({, query }) => {
  const api = useAPI()
  const errorFuncs = useErrorHandlers();
  return (
    <Layout searchQuery={query}>
      <Helmet>{!!query && <title>Search for {query}</title>}</Helmet>
      {query ? <SearchResults {...errorFuncs} query={query} api={api} /> : <NotFound name="anything" />}
      <MoreIdeas />
    </Layout>
  );
};
SearchPage.propTypes = {
  api: PropTypes.any.isRequired,
  query: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
};

export default SearchPage;
