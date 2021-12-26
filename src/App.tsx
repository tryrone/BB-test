import React from 'react';
import './App.css';
import Wrapper from './components/Wrapper';
import {ApolloClient,InMemoryCache,ApolloProvider,HttpLink,from} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import PageContent from './components/PageContent';



const errorLink = onError(({graphqlErrors}:any) => {
  if(graphqlErrors){
    graphqlErrors.map(({message, path}:GraphQLError) => alert(`Graphql error: ${message}`))
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "https://assignment-fa.brandbassador.com/graphql" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
      <Wrapper>
        <PageContent />
      </Wrapper>
    </div>
    </ApolloProvider>
  );
}

export default App;
