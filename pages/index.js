import Head from 'next/head'

import styles from '../styles/Home.module.css'
import ClientOnly from '../components/ClientOnly'
import Me from '../components/Me'
import Questionnaire from '../components/Questionnaire'

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

      <main className={styles.main}>
        <h1 className={styles.title}>Urne</h1>
        <ClientOnly>
          <Me />
          <Questionnaire slug={process.env.NEXT_PUBLIC_QUESTIONNAIRE_SLUG} />
        </ClientOnly>
      </main>

      <footer className={styles.footer}>Fusszeile</footer>
    </div>
  )
}
