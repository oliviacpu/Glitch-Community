import React, { useState, useMemo, createContext } from 'react';
import { keyBy, mapValues } from 'lodash';

import { useAPI } from 'State/api';
import { getAllPages } from 'Shared/api';

const ProjectContect = createContext();

async function getMembers(api, projectId) {
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${projectId}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${projectId}`),
  ]);
  return { users, teams };
}

function loadProjectMembers(api, projectIds, setProjectResponses) {
  // set selected projects to 'loading'
  setProjectResponses((prev) => {
    const next = { ...prev };
    for (const projectId of projectIds) {
      next[projectId] = { ...next[projectId], members: loadingResponse };
    }
    return next;
  });
  // update each project as it loads
  projectIds.forEach(async (projectId) => {
    const members = await getMembers(api, projectId);
    setProjectResponses((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        members: { status: 'ready', value: members },
      },
    }));
  });
}

const loadingResponse = { status: 'loading' };

const ProjectContextProvider = ({ children }) => {
  const [projectResponses, setProjectResponses] = useState({});
  const api = useAPI();

  const value = useMemo(
    () => ({
      getMembers: (projectId) => {
        if (projectResponses[projectId] && projectResponses[projectId].members) {
          return projectResponses[projectId].members;
        }
        loadProjectMembers(api, [projectId], setProjectResponses);
        return loadingResponse;
      },
      reloadProjectMembers: (projectIds) => {
        loadProjectMembers(api, projectIds, setProjectResponses);
      },
    }),
    [projectResponses],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export function useProjectMembers (projectId) {
  const { getMembers } = useContext(ProjectContext);
  const 
}



export default ProjectContextProvider;