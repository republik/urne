import { Checkbox, Interaction, Radio } from '@project-r/styleguide'
import { useContext, useEffect, useState } from 'react'

import { QuestionnaireContext } from './Questionnaire'

const { H3, P } = Interaction

export default function Question({ question }) {
  const { __typename, text, explanation, id } = question
  const [value, setValue] = useState([])
  const { disable, setAnswer } = useContext(QuestionnaireContext)

  useEffect(() => {
    setAnswer(id, { value })
  }, [value])

  if (__typename === 'QuestionTypeChoice') {
    const { cardinality, options } = question

    return (
      <>
        <H3>{text}</H3>
        {explanation && <P>{explanation}</P>}
        {options.map((option) => {
          const checked = value.includes(option.value)

          if (cardinality === 1) {
            return (
              <P key={option.value}>
                <Radio
                  value={option.value}
                  checked={checked}
                  disabled={disable}
                  onChange={(event) => setValue([event.target.value])}
                >
                  {option.label || option.value}
                </Radio>
              </P>
            )
          }

          // disable a checkbox when
          // - context disable is true
          // - or amount of values exceeds cardinality and checkbox is not
          //   checked (to hinder user to add more values.)
          const disabled =
            disable ||
            (cardinality > 1 && value.length >= cardinality && !checked)

          return (
            <P key={option.value}>
              <Checkbox
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={(_, checked) => {
                  setValue(
                    [
                      ...value.filter((value) => value !== option.value),
                      checked && option.value,
                    ].filter(Boolean),
                  )
                }}
              >
                {option.label || option.value}
              </Checkbox>
            </P>
          )
        })}
      </>
    )
  }

  return <P>(Frage kann nicht dargestellt werden.)</P>
}
