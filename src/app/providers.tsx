'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';
import { getApolloClient } from '../lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => getApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}


