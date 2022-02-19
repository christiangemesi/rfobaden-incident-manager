import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css } from 'styled-components'
import { contrastDark, contrastLight, defaultTheme } from '@/theme'
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

  const materialTheme = createTheme({
    overrides: {
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: defaultTheme.colors.primary.value,
          '& *': {
            fontFamily: defaultTheme.fonts.body,
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
          backgroundColor: defaultTheme.colors.primary.value,
          color: defaultTheme.colors.primary.contrast,
          fontFamily: defaultTheme.fonts.body,
        },
        'button': {
          ':hover': {
            filter: 'brightness(130%)',
          },
        },
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          '& *': {
            color: contrastDark,
            fontFamily: defaultTheme.fonts.body,
          },
        },
        dayLabel: {
          color: contrastDark,
          fontFamily: defaultTheme.fonts.body,
        },
      },
      MuiPickersDay: {
        day: {
          color: defaultTheme.colors.primary.value,
          fontFamily: defaultTheme.fonts.body,
          '&:hover': {
            backgroundColor: defaultTheme.colors.secondary.value,
            color: defaultTheme.colors.secondary.contrast,
          },
          '& *': {
            fontFamily: defaultTheme.fonts.body,
          },
        },
        daySelected: {
          color: defaultTheme.colors.primary.contrast,
          backgroundColor: defaultTheme.colors.primary.value,
          fontFamily: defaultTheme.fonts.body,
          '&:hover': {
            color: defaultTheme.colors.primary.contrast,
            backgroundColor: defaultTheme.colors.primary.value,
            filter: 'brightness(130%)',
          },
        },
        dayDisabled: {
          color: defaultTheme.colors.primary.value,
          fontFamily: defaultTheme.fonts.body,
        },
        current: {
          color: contrastDark,
          fontFamily: defaultTheme.fonts.body,
        },
      },
      MuiPickersYear: {
        yearSelected: {
          color: defaultTheme.colors.primary.value,
          fontFamily: defaultTheme.fonts.body,
        },
        root: {
          color: contrastDark,
          fontFamily: defaultTheme.fonts.body,
          '&:hover': {
            backgroundColor: defaultTheme.colors.secondary.value,
          },
        },
      },
      MuiPickersClockNumber: {
        clockNumber: {
          fontFamily: defaultTheme.fonts.body,
          color: contrastDark,
        },
        clockNumberSelected: {
          fontFamily: defaultTheme.fonts.body,
          color: contrastLight,
        },
      },
      MuiPickersClock: {
        pin: {
          backgroundColor: defaultTheme.colors.primary.value,
        },
      },
      MuiPickersClockPointer: {
        thumb: {
          borderColor: defaultTheme.colors.primary.value,
        },
        noPoint: {
          backgroundColor: defaultTheme.colors.primary.value,
        },
        pointer: {
          backgroundColor: defaultTheme.colors.primary.value,
        },
        animateTransform: {
          transition: 'none',
        },
      },
      MuiPickersModal: {
        dialogAction: {
          color: defaultTheme.colors.primary.value,
          fontFamily: defaultTheme.fonts.body,
        },

      },
    },
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
          <MuiPickersUtilsProvider locale={de} utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              autoOk
              clearable
              value={date}
              error={isInvalid}
              onChange={setDate}
              placeholder={placeholder}
              ampm={false}
              allowKeyboardControl={true}
              format="dd.MM.yyyy   HH:mm"
              invalidDateMessage="muss das Format TT.MM.JJJJ hh:mm haben"
              okLabel={<UiButton color="success"><UiIcon.SubmitAction /></UiButton>}
              cancelLabel={<UiButton color="error"><UiIcon.CancelAction /></UiButton>}
              clearLabel={<UiButton color="secondary">Leeren</UiButton>}
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
    background: ${defaultTheme.colors.primary.value};
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.15rem 0.6rem;
    border: solid 1px ${contrastDark};
    height: 120%;

    :hover {
      background: ${defaultTheme.colors.primary.value};
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
