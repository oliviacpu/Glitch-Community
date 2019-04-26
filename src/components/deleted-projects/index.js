// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'Components/text/heading';
import Loader from 'Components/loader';
import Button from 'Components/buttons/button';
import { getAvatarUrl } from 'Models/project';

import { useAPI } from '../../state/api';
import { useTrackedFunc } from '../../presenters/segment-analytics';
import styles from './deleted-projects.styl';

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, { once: true });
  node.classList.add('slide-up');
}

const DeletedProject = ({ id, domain, onClick }) => {
  const onClickUndelete = (evt) => clickUndelete(evt, onClick);
  const onClickTracked = useTrackedFunc(onClickUndelete, 'Undelete clicked');
  return (
    <div className="deleted-project">
      <img className="avatar" src={getAvatarUrl(id)} alt="" />
      <div className="deleted-project-name">{domain}</div>
      <Button small onClick={onClickTracked}>Undelete</div>
    </div>
  );
};
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({ deletedProjects, undelete }) => (
  <ul className="projects-container deleted-projects-container">
    {deletedProjects.map(({ id, domain }) => (
      <li key={id} className="deleted-project-container">
        <DeletedProject id={id} domain={domain} onClick={() => undelete(id)} />
      </li>
    ))}
  </ul>
);
DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func.isRequired,
};

function DeletedProjects({ deletedProjects, setDeletedProjects, undelete }) {
  const api = useAPI();
  // states: hidden | loading | ready
  const [state, setState] = useState('hidden');
  const clickShow = async () => {
    setState('loading');
    try {
      const { data } = await api.get('user/deleted-projects');
      setDeletedProjects(data);
      setState('ready');
    } catch (e) {
      setState('hidden');
    }
  };
  const clickHide = () => {
    setState('hidden');
  };

  if (state === 'hidden') {
    return (
      <Button type="tertiary" onClick={clickShow}>
        Show
      </Button>
    );
  }
  if (state === 'loading') {
    return <Loader />;
  }
  if (!deletedProjects.length) {
    return 'nothing found';
  }
  return (
    <>
      <DeletedProjectsList deletedProjects={deletedProjects} undelete={undelete} />
      <Button type="tertiary" onClick={clickHide}>
        Hide Deleted Projects
      </Button>
    </>
  );
}

DeletedProjects.propTypes = {
  deletedProjects: PropTypes.array,
  setDeletedProjects: PropTypes.func.isRequired,
  undelete: PropTypes.func.isRequired,
};

DeletedProjects.defaultProps = {
  deletedProjects: [],
};

export default DeletedProjects;
