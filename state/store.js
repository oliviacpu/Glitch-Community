import { configureStore } from 'redux-starter-kit'
import { Provider } from 'react-redux'


const createHandlerMiddleware = (...handlerGroups) => {
  const combinedHandlers = {}
  for (const handlerGroup of handlerGroups) {
    for (const [actionType, handler] of Object.entries(handlerGroup)) {
      if (combinedHandlers[actionType]) {
        combinedHandlers[actionType].push(handler)
      } else {
        combinedHandlers[actionType] = [handler]
      }
    }
  }
  
  return (store) => (next) => (action) => {
    const actionProcessedByMiddleware = next(action)
    if (!actionProcessedByMiddleware) return
    
    const handlersForAction = combinedHandlers[actionProcessedByMiddleware.type] 
    if (!handlersForAction) return
    handlersForAction.forEach(handler => handler(actionProcessedByMiddleware, store))
    return actionProcessedByMiddleware
  }
} 

const store = configureStore({
  reducer: (state = {}, action) => state,
})

export default ({ children }) => (
  <Provider store={store}>{children}</Provider>
)
