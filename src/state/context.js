import React, { useContext, createContext, useState } from 'react'

const ReduxContext = createContext()

export const Provider = ({ store }) => 

export const useReduxStore = () => useContext(ReduxContext)

export function useReduxSelector (selector) {
  const store = useReduxStore()
  const [state, setState] = useState(() => selector(store.getState()))
  useEffect(() => {
    return store.subscribe(() => {
      const nextState = selector(store.getState())
      if (nextState !== state) { setState(nextState) }
    })
  }, [store])
  return state
}