import { useContext, useEffect, useState } from 'react'
import { css } from 'glamor'

import { Checkbox, Interaction, Radio } from '@project-r/styleguide'
import { QuestionnaireContext } from './Questionnaire'

const { H2, P } = Interaction

const styles = {
  question: css({
    marginBottom: 25,
  }),
  text: css({
    marginBottom: 25,
  }),
  explanation: css({
    marginBottom: 25,
  }),
  options: css({
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 5,
  }),
  option: css({
    marginTop: 0,
    display: 'table',
    breakInside: 'avoid-column',
  }),
}

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
      <div {...styles.question}>
        <H2 {...styles.text}>{text}</H2>
        {explanation && <P {...styles.text}>{explanation}</P>}
        <div {...styles.options}>
          {options.map((option, i) => {
            const checked = value.includes(option.value)

            if (cardinality === 1) {
              return (
                <div key={i} {...styles.option}>
                  <Radio
                    value={option.value}
                    checked={checked}
                    disabled={disable}
                    onChange={(event) => setValue([event.target.value])}
                  >
                    {option.label || option.value}
                  </Radio>
                </div>
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
              <div key={i} {...styles.option}>
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
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
