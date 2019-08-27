import React from 'react'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { Provider } from 'react-redux'
import createHandlerMiddleware from  './handler-middleware'

const store = configureStore({
  reducer: (state = {}, _action) => state,
  middleware: [
    ...getDefaultMiddleware(), 
    createHandlerMiddleware()
  ],
  devTools: process.env.NODE_ENV !== 'production',
})

export default ({ children }) => (
  <Provider store={store}>{children}</Provider>
)
