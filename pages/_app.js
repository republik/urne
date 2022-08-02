import { ApolloProvider } from '@apollo/client'
import { ColorContextProvider } from '@project-r/styleguide'

import client from '../apollo-client'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ColorContextProvider root>
        <Component {...pageProps} />
      </ColorContextProvider>
    </ApolloProvider>
  )
}
export default MyApp
