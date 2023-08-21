import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './features/user.js';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // Retrieve the token (from localStorage, state management, etc.)
  const token = localStorage.getItem('Authorization');

  // Return the headers with the new Authorization header
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
);
