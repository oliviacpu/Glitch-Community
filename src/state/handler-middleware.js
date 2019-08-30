/*
A "handler" is a function with the shape `(action, store) => {}`
that is called after an action is dispatched to the Redux store,
executes side effects (e.g. logging, network calls, writing to local storage),
and potentially dispatches additional actions.

A "handler map" is an object map with the shape `{[action type]: handler}`


createHandlerMiddleware takes

*/

const createHandlerMiddleware = (...handlerMaps) => {
  const combinedHandlers = {};
  for (const handlerMap of handlerMaps) {
    for (const [actionType, handler] of Object.entries(handlerMap)) {
      if (combinedHandlers[actionType]) {
        combinedHandlers[actionType].push(handler);
      } else {
        combinedHandlers[actionType] = [handler];
      }
    }
  }

  return (store) => (next) => (action) => {
    const actionProcessedByMiddleware = next(action);
    if (!actionProcessedByMiddleware) return actionProcessedByMiddleware;

    const handlersForAction = combinedHandlers[actionProcessedByMiddleware.type];
    if (!handlersForAction) return actionProcessedByMiddleware;

    handlersForAction.forEach((handler) => handler(actionProcessedByMiddleware, store));
    return actionProcessedByMiddleware;
  };
};

export default createHandlerMiddleware;
