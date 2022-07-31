import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
  query Me {
    me {
      name
      portrait(properties: { width: 200, height: 200, bw: true })
    }
  }
`

export default function Me() {
  const { data, loading, error } = useQuery(QUERY)

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error(error)
    return null
  }

  console.log('Me', data)

  const me = data.me

  if (!me) {
    return <h2>Ich weiss noch nicht, wer du bist.</h2>
  }

  return <h1>Hi, {me.name}</h1>
}
