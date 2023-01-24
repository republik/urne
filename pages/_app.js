import { ApolloProvider } from '@apollo/client'
import { ColorContextProvider, Center } from '@project-r/styleguide'

import client from '../apollo-client'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ColorContextProvider root>
        <Center>
          <Component {...pageProps} />
        </Center>
      </ColorContextProvider>
    </ApolloProvider>
  )
}
export default MyApp
