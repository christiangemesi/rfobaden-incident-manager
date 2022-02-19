import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css } from 'styled-components'
import { contrastDark, defaultTheme } from '@/theme'
import { createMuiTheme, IconButton, InputAdornment } from '@material-ui/core'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ThemeProvider } from '@material-ui/styles'


interface Props extends UiInputProps<Date | null> {
  label?: string
  placeholder?: string
}

const UiDateInput: React.VFC<Props> = ({
  label,
  placeholder = '',
  onChange: handleChange,
  errors = [],
}) => {

  // const [text, setText] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [isInvalid, setInvalid] = useState<boolean>(false)

  useUpdateEffect(() => {
    if (date === null) {
      handleChange(null)
      setInvalid(false)
      return
    }
    // const [date, time] = text.split(' ', 2).map((n) => n.trim())
    // const [hour, min] = time === undefined ? [0, 0] : time.split(':', 2).map((n) => parseInt(n.trim()))
    // const [day, month, year] = date.split('.', 3).map((n) => parseInt(n.trim()))
    // const newDate = new Date(Date.UTC(year, month - 1, day, hour - 1, min))

    if (isNaN(date.getTime())) {
      handleChange(null)
      setInvalid(true)
      return
    }
    handleChange(date)
    setInvalid(false)
  }, [date])

  const Label = label == null ? 'div' : StyledLabel
  const hasError = errors.length !== 0

  const materialTheme = createMuiTheme({

  })

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <ThemeProvider theme={materialTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              autoOk
              clearable
              ampm={false}
              value={date}
              onChange={setDate}
              format="dd.MM.yyyy   HH:mm"
              placeholder={placeholder}
              error={isInvalid}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <UiIcon.Calendar />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </InputAndErrorBox>
      <UiInputErrors errors={errors} />
    </Label>
  )
}

export default UiDateInput

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;

  // Affects only label text
  & > span:first-child {
    font-size: 0.9rem;
    font-weight: bold;
  }
`

const InputAndErrorBox = styled.div<{ hasError: boolean }>`
  display: flex;

  .MuiInput-underline {
    :after, :before {
      content: none;
    }
  }

  .MuiTextField-root {
    width: 100%;
  }

  .MuiInput-input {
    padding: 0.5rem;
  }

  .MuiIconButton-root {
    background: ${defaultTheme.colors.primary.value};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.15rem 0.6rem;
    border: solid 1px ${contrastDark};

    .MuiSvgIcon-root {
      fill: white;
    }
  }

  .MuiInput-root {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    outline: none;
    width: 100%;
    background: white;
    border: 1px solid ${contrastDark};
    font-family: ${({ theme }) => theme.fonts.body};

    transition: 250ms ease;
    transition-property: border-color;
  }

  ${({ hasError }) => !hasError && css`
    input {
      :active, :focus {
        border-color: ${defaultTheme.colors.primary.value};
      }
    }
  `}

  ${({ hasError }) => hasError && css`
    input {
      border-color: ${defaultTheme.colors.error.value};
    }
  `}
`
