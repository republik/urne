import getConfig from 'next/config'
import Head from 'next/head'
import { css } from 'glamor'

const styles = {
  container: css({
    padding: '0 2rem',
  }),
  main: css({
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
}

const { publicRuntimeConfig } = getConfig()

export default function Index() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Urne</title>
        <link rel='icon' href='/favicon-32.png' sizes='32x32' />
        <link rel='icon' href='/favicon-128.png' sizes='128x128' />
        <link rel='icon' href='/favicon-192.png' sizes='192x192' />
        <link rel='apple-touch-icon' href='/favicon-180.png' sizes='180x180' />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <main {...styles.main}>
        <p>{publicRuntimeConfig.hash}</p>
        <p>{publicRuntimeConfig.buildId}</p>
      </main>
    </div>
  )
}
