import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css } from 'styled-components'
import DatePicker from 'react-datepicker'
import { de } from 'date-fns/locale'

import 'react-datepicker/dist/react-datepicker.css'
import 'rc-time-picker/assets/index.css'

interface Props extends UiInputProps<Date | null> {
  label?: string
  labelTime?: string
  placeholder?: string
  className?: string
  isModal?: boolean
}

const UiDateInput: React.VFC<Props> = ({
  value,
  label,
  labelTime = 'Zeit: ',
  placeholder = 'dd.MM.yyyy',
  className = '',
  isModal = false,
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

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <DateTimePicker isNull={date == null}>
          <DatePicker
            locale={de}
            selected={date}
            onChange={(date) => setDate(date)}
            yearDropdownItemNumber={3}
            placeholderText={placeholder}
            timeInputLabel={labelTime}
            dateFormat="dd.MM.yyyy HH:mm"
            timeFormat="HH:mm"
            className={className + ' dateTimeInput'}
            popperClassName={className + ' dateTimePopupContainer'}
            calendarClassName={className + ' dateTimePopup'}
            withPortal={isModal}
            shouldCloseOnSelect
            showTimeInput
            showMonthDropdown
            showYearDropdown
            showWeekNumbers
            isClearable
          />
        </DateTimePicker>
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

const DateTimePicker = styled.div<{ isNull: boolean }>`
  width: 100%;
  height: 100%;

  .react-datepicker__input-container {
    position: relative;

    .react-datepicker__close-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      &::after {
        background: transparent;
        color: black;
        font-size: 14px;
      }
    }
  }

  input.dateTimeInput {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
    font-family: ${({ theme }) => theme.fonts.body};

    transition: 250ms ease;
    transition-property: border-color;
  }

  .react-datepicker__input-time-container {
    width: 100%;
    margin: 0;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    div.react-datepicker-time__input {
      margin: 0;
      padding-left: 1rem;
    }

    input.react-datepicker-time__input, input.timeInput {
      margin: 0;
      font-size: 0.9rem;
      border-radius: 0.5rem;
      outline: none;
      width: 100%;
      border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
      font-family: ${({ theme }) => theme.fonts.body};

      transition: 250ms ease;
      transition-property: border-color;
    }
  }

  .timeInput {
    display: flex;
    align-items: center;
    position: relative;

    svg {
      position: absolute;
      right: 0.5rem;
      z-index: 10;
    }
  }

  .dateTimePopup {
    font-family: ${({ theme }) => theme.fonts.body};
    border-color: ${({ theme }) => theme.colors.primary.value};
    background: ${({ theme }) => theme.colors.tertiary.value};
    color: ${({ theme }) => theme.colors.tertiary.contrast};


    .react-datepicker__navigation-icon::before {
      border-color: ${({ theme }) => theme.colors.primary.value};
    }

    .react-datepicker__header {
      background: ${({ theme }) => theme.colors.secondary.value};
      color: ${({ theme }) => theme.colors.secondary.contrast};

      .react-datepicker__current-month {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.2rem;
        margin-bottom: 0.5rem;
      }

      .react-datepicker__header__dropdown {
        height: 1.5rem;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .react-datepicker__month-dropdown-container {
          width: 40%;
        }

        .react-datepicker__year-dropdown-container {
          width: 30%;
        }

        .react-datepicker__month-dropdown-container,
        .react-datepicker__year-dropdown-container {
          background: ${({ theme }) => theme.colors.tertiary.value};
          color: ${({ theme }) => theme.colors.tertiary.contrast};
          position: relative;

          .react-datepicker__year-dropdown {
            left: auto;
            right: 0;
          }

          .react-datepicker__month-dropdown {
            left: 0;
          }

          .react-datepicker__year-dropdown,
          .react-datepicker__month-dropdown {
            width: 100%;
            top: auto;
            position: relative;
            padding: 0.2rem;
            border-color: ${({ theme }) => theme.colors.primary.value};
            background: ${({ theme }) => theme.colors.tertiary.value};

            .react-datepicker__navigation {
              color: ${({ theme }) => theme.colors.tertiary.contrast};

              &.react-datepicker__navigation--years-upcoming {
                content: '˄';
              }

              &.react-datepicker__navigation--years-previous {
                content: '˅';
              }
            }

            .react-datepicker__year-option--selected,
            .react-datepicker__month-option--selected {
              display: none;
            }

            .react-datepicker__year-option--selected_year,
            .react-datepicker__month-option--selected_month {
              background: ${({ theme }) => theme.colors.primary.value};
              color: ${({ theme }) => theme.colors.primary.contrast};
            }

            .react-datepicker__month-option,
            .react-datepicker__year-option {
              &:hover {
                background: ${({ theme }) => theme.colors.secondary.value};
                color: ${({ theme }) => theme.colors.secondary.contrast};
              }
            }
          }
        }

        .react-datepicker__month-read-view,
        .react-datepicker__year-read-view {
          display: flex;
          justify-content: space-between;
          flex-direction: row-reverse;
          align-items: center;
          height: 100%;
          font-size: 10px;
          overflow: hidden;
          padding: 0.2rem;

          span {
            position: relative;
          }

          .react-datepicker__month-read-view--down-arrow,
          .react-datepicker__year-read-view--down-arrow {
            border-color: ${({ theme }) => theme.colors.tertiary.contrast};
            right: auto;
            height: 6px;
            width: 6px;
            border-width: 1px 1px 0 0;
            margin: 0.2rem;
            transform: translateY(-30%) rotate(135deg);
          }
        }
      }

      .react-datepicker__day-name {

      }
    }

    .react-datepicker__triangle {
      left: 50% !important;
      transform: translateX(-50%) !important;

      &::before, &::after {
        border-bottom-color: ${({ theme }) => theme.colors.secondary.value};
      }
    }

    .react-datepicker__day--today {
      color: ${({ theme }) => theme.colors.error.value};
    }

    .react-datepicker__day {
      color: ${({ theme }) => theme.colors.tertiary.contrast};

      &:hover {
        background: ${({ theme }) => theme.colors.secondary.value};
        color: ${({ theme }) => theme.colors.secondary.contrast};
      }
    }

    .react-datepicker__day--outside-month {
      color: ${({ theme }) => theme.colors.secondary.value};
    }


    .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
      background: ${({ theme }) => theme.colors.primary.value};
      color: ${({ theme }) => theme.colors.primary.contrast};
      ${({ isNull }) => isNull && css`
        background: ${({ theme }) => theme.colors.tertiary.value};
        color: ${({ theme }) => theme.colors.tertiary.contrast};

        &.react-datepicker__day--today {
          color: ${({ theme }) => theme.colors.error.value};
        }
      `}
    }

    .react-datepicker__day--today:not(:hover):not(.react-datepicker__day--selected) {
      color: ${({ theme }) => theme.colors.error.value};
    }
  }
`
