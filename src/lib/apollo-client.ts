import { ApolloClient, InMemoryCache, HttpLink, FetchPolicy, MutationFetchPolicy } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let apolloClient: ApolloClient<any> | null = null;

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'https://api.zoion.biz/v1/graphql',
});

export const createApolloClient = () => {
  const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(adminSecret ? { 'x-hasura-admin-secret': adminSecret } : {}),
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      },
      query: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      },
      mutate: {
        fetchPolicy: 'no-cache' as MutationFetchPolicy,
      },
    },
  });
};

export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

export const resetApolloClient = () => {
  apolloClient = null;
};


