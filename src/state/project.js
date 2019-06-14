import  React, { useState, useMemo, createContext } from 'react'
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
  
  const value = useMemo(() => {
  
    return {
      getMembers: (projectId) => {
        if (projectResponses[projectId] && projectResponses[projectId].members) {
          return projectResponses[projectId].members;
        }
        setProjectResponse((prev) => ({
          ...prev,
          [projectId]: {
            ...prev[projectId],
            members: loadingResponse,
          }
        }))
        
        return loadingResponse;
      }  
    } 
  }, [projectResponses]);
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}