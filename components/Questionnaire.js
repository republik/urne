import { useQuery, gql, useMutation } from '@apollo/client'
import { A, Button, Interaction, useColorContext } from '@project-r/styleguide'
import { css, merge } from 'glamor'
import { createContext, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

import Question from './Question'

const { H1, P } = Interaction

const styles = {
  description: css({
    marginBottom: 50,
  }),
  padded: css({
    padding: 25,
  }),
  me: css({
    marginBottom: 25,
  }),
  eligibilityHint: css({
    marginBottom: 25,
  }),
  submitError: css({
    marginBottom: 10,
  }),
  cta: css({
    marginTop: 75,
  }),
}

const fragmentQuestion = gql`
  fragment Question on QuestionInterface {
    id
    private
    text
    explanation

    ... on QuestionTypeChoice {
      cardinality
      options {
        label
        value
      }
    }

    userAnswer {
      id
      payload
      submitted
    }

    turnout {
      submitted
    }
  }
`

const fragmentQuestionnaire = gql`
  fragment Questionnaire on Questionnaire {
    id
    description
    beginDate
    endDate

    userIsEligible
    userHasSubmitted
    userSubmitDate

    allowedRoles

    submitAnswersImmediately
    resubmitAnswers
    revokeSubmissions
    unattributedAnswers

    questions {
      ...Question
    }
  }

  ${fragmentQuestion}
`

const QUERY = gql`
  query GetQuestionnaire($slug: String!) {
    me {
      id
      name
      email
    }
    questionnaire(slug: $slug) {
      ...Questionnaire
    }
  }

  ${fragmentQuestionnaire}
`

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($answer: AnswerInput!) {
    submitAnswer(answer: $answer) {
      ...Question
    }
  }

  ${fragmentQuestion}
`

const SUBMIT_QUESTIONNAIRE = gql`
  mutation AnonymizeSubmission($questionnaireId: ID!) {
    anonymizeUserAnswers(questionnaireId: $questionnaireId) {
      ...Questionnaire
    }
  }

  ${fragmentQuestionnaire}
`

export const QuestionnaireContext = createContext()

export default function Questionnaire({ slug }) {
  const { data, loading, error } = useQuery(QUERY, { variables: { slug } })
  const [answers, setAnswers] = useState({})

  const [
    submitAnswer,
    { loading: loadingSubmitAnswer, error: errorSubmitAnswer },
  ] = useMutation(SUBMIT_ANSWER)
  const [
    submitQuestionnaire,
    { loading: loadingSubmitQuestionnaire, error: errorSubmitQuestionnaire },
  ] = useMutation(SUBMIT_QUESTIONNAIRE)

  const onSubmit = async (e) => {
    await Promise.all(
      Object.keys(answers).map((questionId) =>
        submitAnswer({
          variables: {
            answer: {
              id: uuid(),
              questionId,
              payload: answers[questionId],
            },
          },
        }),
      ),
    )

    await submitQuestionnaire({
      variables: { questionnaireId: data.questionnaire.id },
    })
  }

  if (loading) {
    return <P>Lade ???</P>
  }

  if (error) {
    console.error(error)
    return <P>Ein Fehler ist aufgetreten.</P>
  }

  if (!data.questionnaire) {
    return <P>Fragebogen nicht gefunden.</P>
  }

  const { me, questionnaire } = data
  const {
    beginDate,
    endDate,
    description,
    userIsEligible,
    questions,
    userHasSubmitted,
  } = questionnaire

  const value = {
    disable:
      new Date(beginDate) > new Date() ||
      new Date(endDate) < new Date() ||
      !userIsEligible ||
      loadingSubmitAnswer ||
      loadingSubmitQuestionnaire ||
      userHasSubmitted,
    setAnswer: (questionId, payload) => {
      setAnswers({
        ...answers,
        [questionId]: payload,
      })
    },
    me,
    questionnaire,
    submitError:
      errorSubmitAnswer?.message || errorSubmitQuestionnaire?.message,
  }

  return (
    <QuestionnaireContext.Provider value={value}>
      <H1 {...styles.description}>{description}</H1>

      <SigninHint />
      <EligibilityHints />

      {/* Questions */}
      {questions?.map((question) => (
        <Question key={question.id} question={question} />
      ))}

      <div {...styles.cta}>
        <SubmitError />
        <Button primary block disabled={value.disable} onClick={onSubmit}>
          Abschicken
        </Button>
      </div>
    </QuestionnaireContext.Provider>
  )
}

function SigninHint() {
  const { me } = useContext(QuestionnaireContext)
  const [colorScheme] = useColorContext()

  if (!me) {
    return (
      <div
        {...merge(
          styles.me,
          colorScheme.set('backgroundColor', 'alert'),
          styles.padded,
        )}
      >
        <P>
          Du bist nicht angemeldet.
          {process.env.NEXT_PUBLIC_SIGNIN_URL && (
            <>
              {' '}
              Um teilzunehmen, melde dich{' '}
              <A href={process.env.NEXT_PUBLIC_SIGNIN_URL}>hier an</A>.
            </>
          )}
        </P>
      </div>
    )
  }

  return null
}

function EligibilityHints() {
  const { me, questionnaire } = useContext(QuestionnaireContext)
  const [colorScheme] = useColorContext()

  const { beginDate, endDate, userIsEligible, userHasSubmitted } = questionnaire

  const eligibilityAlert = merge(
    styles.eligibilityHint,
    colorScheme.set('backgroundColor', 'alert'),
    styles.padded,
  )

  if (new Date(beginDate) > new Date()) {
    return (
      <div {...eligibilityAlert}>
        <P>Noch l??uft die Umfrage nicht.</P>
      </div>
    )
  }

  if (new Date(endDate) < new Date()) {
    return (
      <div {...eligibilityAlert}>
        <P>Die Umfrage ist vorbei.</P>
      </div>
    )
  }

  if (me && !userIsEligible) {
    return (
      <div {...eligibilityAlert}>
        <P>Die Konto kann nicht teilnehmen.</P>
      </div>
    )
  }

  if (userHasSubmitted) {
    return (
      <div {...eligibilityAlert}>
        <P>Du hast teilgenommen.</P>
      </div>
    )
  }

  if (me) {
    return <P {...styles.eligibilityHint}>Du nimmst als {me.name} teil.</P>
  }

  return null
}

function SubmitError() {
  const { submitError } = useContext(QuestionnaireContext)
  const [colorScheme] = useColorContext()

  const style = merge(
    styles.submitError,
    colorScheme.set('backgroundColor', 'alert'),
    styles.padded,
  )

  if (submitError) {
    return (
      <div {...style}>
        <P>{submitError}</P>
      </div>
    )
  }

  return null
}
