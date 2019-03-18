import { createReducer } from 'redux-starter-kit';

export const initState = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
}

export const reducer = createReducer(initState, {
  loadedUser: (_, { payload }) => payload,
});

export const middleware = []