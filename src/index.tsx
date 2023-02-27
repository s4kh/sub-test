import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { OperationDefinitionNode } from 'graphql';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getMainDefinition } from '@apollo/client/utilities';

const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://test/graphql';
const WS_URL = process.env.REACT_WS_ENDPOINT || 'wss://test/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

const wsLink = new GraphQLWsLink(createClient({
  url: WS_URL,
  connectionParams: async () => {
    // Replace it with logged in user token
    const token = '';
    return {
      authorization: token ? `Bearer ${token}` : '',
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
}));

const httpOrGraphqlLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: httpOrGraphqlLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
