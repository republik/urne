import { useQuery, gql, useMutation } from '@apollo/client'
import { Button, Interaction } from '@project-r/styleguide'
import { createContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

const { H2, P } = Interaction

import Question from './Question'

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

  const [submitAnswer, { loading: loadingSubmitAnswer }] =
    useMutation(SUBMIT_ANSWER)
  const [submitQuestionnaire, { loading: loadingSubmitQuestionnaire }] =
    useMutation(SUBMIT_QUESTIONNAIRE)

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
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error(error)
    return null
  }

  const questionnaire = data.questionnaire

  if (!questionnaire) {
    return <h2>Ich weiss noch nicht, wer du bist.</h2>
  }

  const { description, questions, userHasSubmitted } = questionnaire

  console.log({ userHasSubmitted })

  const value = {
    disable:
      loadingSubmitAnswer || loadingSubmitQuestionnaire || userHasSubmitted,
    setAnswer: (questionId, payload) => {
      setAnswers({
        ...answers,
        [questionId]: payload,
      })
    },
  }

  return (
    <QuestionnaireContext.Provider value={value}>
      <H2>{description}</H2>
      {questions?.map((question) => (
        <Question key={question.id} question={question} />
      ))}
      <div>
        <Button onClick={onSubmit} disabled={value.disable}>
          Abstimmen
        </Button>
      </div>
    </QuestionnaireContext.Provider>
  )
}
