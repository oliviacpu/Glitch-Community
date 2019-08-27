import { configureStore } from 'redux-starter-kit'
import { Provider } from 'react-redux'

const store = configureStore({
  reducer: (state = {}, action) => state,
})

export default ({ children }) => (
  <Provider store={store}>{children}</Provider>
)
