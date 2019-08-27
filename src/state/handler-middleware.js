const createHandlerMiddleware = (...handlerGroups) => {
  const combinedHandlers = {};
  for (const handlerGroup of handlerGroups) {
    for (const [actionType, handler] of Object.entries(handlerGroup)) {
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
