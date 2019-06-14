import  React, { useState, useMemo, createContext } from 'react'

import { useAPI } from 'State/api'
import { getAllPages } from 'Shared/api'

const ProjectContect = createContext()

async function getMembers (api, projectId) {
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${projectId}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${projectId}`),
  ]);
  return { users, teams };
};

const loadingResponse = { status: 'loading' }

const ProjectContextProvider = ({ children }) => {
  const [projectResponses, setProjectResponses] = useState({})
  const api = useAPI()
  
  function loadProjectMembers(projectIDs) {
    setProjectResponses((prev) => ({
      ...prev,
      ...mapValues(keyBy(projectIDs),  () => loadingResponse)
    })
    
          
      setProjectResponses((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          members: loadingResponse,
        }
      }));
      getMembers(api, projectId).then(members => {
        setProjectResponses((prev) => ({
          ...prev,
          [projectId]: {
            ...prev[projectId],
            members: { status: 'ready', value: members }
          }
        }));
      })


  }
  
  const value = useMemo(() => ({
    getMembers: (projectId) => {
      if (projectResponses[projectId] && projectResponses[projectId].members) {
        return projectResponses[projectId].members;
      }
      loadProjectMembers([projectId]);
      return loadingResponse;
    },
    reloadProjectMembers: (projectIds) => {
      loadProjectMembers(projectIds)
    }
  }), [projectResponses]);
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}