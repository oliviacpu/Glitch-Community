// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/loader';
import Button from 'Components/buttons/button';
import { getAvatarUrl } from 'Models/project';

import { useAPI } from '../../state/api';
import { useTrackedFunc } from '../../presenters/segment-analytics';
import styles from './deleted-projects.styl';

const DeletedProject = ({ id, domain, onClick }) => (
  <Button type="transparent" onClick={onClick}>
    <div className={styles.deletedProject}>
      <img className={styles.avatar} src={getAvatarUrl(id)} alt="" />
      <div className={styles.projectName}>{domain}</div>
      <Button small decorative>
        Undelete
      </Button>
    </div>
  </Button>
);
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({ deletedProjects, undelete }) => {
  const undeleteTracked = useTrackedFunc(undelete, 'Undelete clicked');

  const ref = useRef();
  // TODO: can this be more ... react-y?
  const onClick = (id) => {
    const node = ref.current;
    if (!node) return;
    node.addEventListener('animationend', () => undeleteTracked(id), { once: true });
    node.classList.add('slide-up');
  };

  return (
    <ul className={styles.deletedProjectsContainer}>
      {deletedProjects.map(({ id, domain }) => (
        <li ref={ref} key={id} className={styles.deletedProjectItemWrap}>
          <DeletedProject id={id} domain={domain} onClick={() => onClick(id)} />
        </li>
      ))}
    </ul>
  );
};
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
