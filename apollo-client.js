import { ApolloClient, InMemoryCache } from '@apollo/client'

const config = {
  possibleTypes: {
    QuestionInterface: [
      'QuestionTypeText',
      'QuestionTypeChoice',
      'QuestionTypeRange',
      'QuestionTypeDocument',
    ],
  },
}

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  cache: new InMemoryCache(config),
  name: 'republik/vote',
  version: '0.1',
})

export default client
