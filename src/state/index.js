import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import * as currentUser from './current-user'

const store = configureStore({
  reducers: {
    currentUser: currentUser.reducer,
  },
  middleware: [
    ...getDefaultMiddleware(), 
    ...currentUser.middleware
  ],
});

export default store;
