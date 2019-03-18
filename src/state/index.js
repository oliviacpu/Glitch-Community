import { configureStore, createSlice, getDefaultMiddleware } from 'redux-starter-kit';
import { before }

const currentUser = createSlice({
  initialState: {
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
  },
  reducers: {},
});

const sentryMiddleware = (store) => (next) => (action) => {

}

const store = configureStore({
  reducers: {
    currentUser,
  },
  middleware: [...getDefaultMiddleware()],
  devTools: true,
});

export default store;
