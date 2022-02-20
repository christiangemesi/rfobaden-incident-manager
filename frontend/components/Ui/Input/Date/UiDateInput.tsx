import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css, useTheme } from 'styled-components'
import { createTheme, IconButton, InputAdornment } from '@material-ui/core'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ThemeProvider } from '@material-ui/styles'
import UiButton from '@/components/Ui/Button/UiButton'
import { de } from 'date-fns/locale'


interface Props extends UiInputProps<Date | null> {
  label?: string
  placeholder?: string
}

const UiDateInput: React.VFC<Props> = ({
  value,
  label,
  placeholder = '',
  onChange: handleChange,
  errors = [],
}) => {

  const [date, setDate] = useState<Date | null>(value)
  const [isInvalid, setInvalid] = useState<boolean>(false)

  useUpdateEffect(() => {
    if (date === null) {
      handleChange(null)
      setInvalid(false)
      return
    }

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

  const theme = useTheme()
  // const dateTimePicker = useMemo(() -> {
  const materialTheme = createTheme({
    overrides: {
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: theme.colors.primary.value,
          '& *': {
            fontFamily: theme.fonts.body,
          },
          '& h3': {
            fontSize: '2rem',
          },
          '& h4': {
            fontSize: '1.7rem',
            paddingRight: '0.5rem',
          },
        },
      },
      MuiPickerDTTabs: {
        tabs: {
          backgroundColor: theme.colors.primary.value,
          color: theme.colors.primary.contrast,
          fontFamily: theme.fonts.body,
        },
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          '& *': {
            color: theme.colors.tertiary.contrast,
            fontFamily: theme.fonts.body,
          },
        },
        dayLabel: {
          color: theme.colors.tertiary.contrast,
          fontFamily: theme.fonts.body,
        },
      },
      MuiPickersDay: {
        day: {
          color: theme.colors.primary.value,
          fontFamily: theme.fonts.body,
          '&:hover': {
            backgroundColor: theme.colors.secondary.value,
            color: theme.colors.secondary.contrast,
          },
          '& *': {
            fontFamily: theme.fonts.body,
          },
        },
        daySelected: {
          color: theme.colors.primary.contrast,
          backgroundColor: theme.colors.primary.value,
          fontFamily: theme.fonts.body,
          '&:hover': {
            color: theme.colors.primary.contrast,
            backgroundColor: theme.colors.primary.value,
            filter: 'brightness(130%)',
          },
        },
        dayDisabled: {
          color: theme.colors.primary.value,
          fontFamily: theme.fonts.body,
        },
        current: {
          color: theme.colors.tertiary.contrast,
          fontFamily: theme.fonts.body,
        },
      },
      MuiPickersYear: {
        yearSelected: {
          color: theme.colors.primary.value,
          fontFamily: theme.fonts.body,
        },
        root: {
          color: theme.colors.tertiary.contrast,
          fontFamily: theme.fonts.body,
          '&:hover': {
            backgroundColor: theme.colors.secondary.value,
          },
        },
      },
      MuiPickersClockNumber: {
        clockNumber: {
          fontFamily: theme.fonts.body,
          color: theme.colors.tertiary.contrast,
        },
        clockNumberSelected: {
          fontFamily: theme.fonts.body,
          color: theme.colors.tertiary.value,
        },
      },
      MuiPickersClock: {
        pin: {
          backgroundColor: theme.colors.primary.value,
        },
      },
      MuiPickersClockPointer: {
        thumb: {
          borderColor: theme.colors.primary.value,
        },
        noPoint: {
          backgroundColor: theme.colors.primary.value,
        },
        pointer: {
          backgroundColor: theme.colors.primary.value,
        },
        animateTransform: {
          transition: 'none',
        },
      },
    },
  })
  // return <ThemeProvider theme={materialTheme}>
  {/*}, [theme, ])*/
  }

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <ThemeProvider theme={materialTheme}>
          <MuiPickersUtilsProvider locale={de} utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              autoOk
              clearable
              allowKeyboardControl
              value={date}
              error={isInvalid}
              onChange={setDate}
              placeholder={placeholder}
              ampm={false}
              format="dd.MM.yyyy HH:mm"
              invalidDateMessage="muss das Format dd.MM.yyyy hh:mm haben"
              okLabel={<UiButton color="success"><UiIcon.SubmitAction /></UiButton>}
              cancelLabel={<UiButton color="error"><UiIcon.CancelAction /></UiButton>}
              clearLabel={<UiButton color="warning">Zurücksetzen</UiButton>}
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

  .MuiInputAdornment-root {
    height: 100%;
  }

  .MuiIconButton-root {
    background: ${({ theme }) => theme.colors.primary.value};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.15rem 0.6rem;
    border: solid 1px ${({ theme }) => theme.colors.tertiary.contrast};
    height: 120%;

    :hover {
      background: ${({ theme }) => theme.colors.primary.value};
      filter: brightness(130%);
    }

    .MuiIconButton-label {
      height: 100%;
    }

    .MuiSvgIcon-root {
      fill: white;
      max-height: 90%;
    }
  }

  .MuiInput-root {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    outline: none;
    width: 100%;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
    font-family: ${({ theme }) => theme.fonts.body};

    transition: 250ms ease;
    transition-property: border-color;
  }

  ${({ hasError }) => !hasError && css`
    input {
      :active, :focus {
        border-color: ${({ theme }) => theme.colors.primary.value};
      }
    }
  `}

  ${({ hasError }) => hasError && css`
    input {
      border-color: ${({ theme }) => theme.colors.error.value};
    }
  `}
`
