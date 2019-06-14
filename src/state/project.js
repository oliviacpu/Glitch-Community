import React, { useState, useMemo, useContext, createContext } from 'react';

import { useAPI } from 'State/api';
import { getAllPages } from 'Shared/api';

export const ProjectContext = createContext();

async function getMembers(api, projectId, withCacheBust) {
  const cacheBust = withCacheBust ? `&cacheBust=${Date.now()}` : '';
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${projectId}${cacheBust}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${projectId}${cacheBust}`),
  ]);
  return { users, teams };
}

const loadingResponse = { status: 'loading' };

function loadProjectMembers(api, projectIds, setProjectResponses, withCacheBust) {
  // set selected projects to 'loading' if they haven't been initialized yet
  setProjectResponses((prev) => {
    const next = { ...prev };
    for (const projectId of projectIds) {
      if (!next[projectId] || !next[projectId].members) {
        next[projectId] = { ...next[projectId], members: loadingResponse };  
      }
    }
    return next;
  });
  // update each project as it loads
  projectIds.forEach(async (projectId) => {
    const members = await getMembers(api, projectId, withCacheBust);
    setProjectResponses((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        members: { status: 'ready', value: members },
      },
    }));
  });
}

export const ProjectContextProvider = ({ children }) => {
  const [projectResponses, setProjectResponses] = useState({});
  const api = useAPI();

  const value = useMemo(
    () => ({
      getProjectMembers: (projectId) => {
        if (projectResponses[projectId] && projectResponses[projectId].members) {
          return projectResponses[projectId].members;
        }
        loadProjectMembers(api, [projectId], setProjectResponses);
        return loadingResponse;
      },
      reloadProjectMembers: (projectIds) => {
        loadProjectMembers(api, projectIds, setProjectResponses, true);
      },
    }),
    [projectResponses, api],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export function useProjectMembers(projectId) {
  const { getProjectMembers } = useContext(ProjectContext);
  return getProjectMembers(projectId);
}

export function useProjectReload() {
  const { reloadProjectMembers } = useContext(ProjectContext);
  return reloadProjectMembers;
}
