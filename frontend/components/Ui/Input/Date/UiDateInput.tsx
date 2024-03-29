import React, { useCallback, useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useToggle, useUpdateEffect } from 'react-use'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css } from 'styled-components'
import DatePicker from 'react-datepicker'
import { de } from 'date-fns/locale'
import { Themed } from '@/theme'
import UiIcon from '@/components/Ui/Icon/UiIcon'

// Default date picker styling
import 'react-datepicker/dist/react-datepicker.css'

interface Props extends UiInputProps<Date | null> {
  /**
   * Text of the input label.
   */
  label?: string

  /**
   * Text of the input placeholder.
   */
  placeholder?: string

  /**
   * Class name of the date picker.
   */
  className?: string

  /**
   * Placement of the date time picker popup.
   */
  placement?: 'top' | 'bottom' | 'auto'
}

/**
 * `UiDateInput` is an input component for a {@link Date} value.
 */
const UiDateInput: React.VFC<Props> = ({
  value,
  label = '',
  placeholder = 'dd.mm.yyyy hh:mm',
  placement = 'auto',
  className,
  onChange: handleChange,
  errors = [],
}) => {

  const [date, setDate] = useState(value)
  const [isInvalid, setInvalid] = useState(false)
  const [isOpen, toggleOpen] = useToggle(false)

  useUpdateEffect(function handleDateTimeValidation() {
    // Handle no date.
    if (date === null) {
      handleChange(null)
      setInvalid(false)
      return
    }

    // Handle wrong formatted date.
    if (isNaN(date.getTime())) {
      handleChange(null)
      setInvalid(true)
      return
    }

    // Handle correct date.
    handleChange(date)
    setInvalid(false)
  }, [date])

  // Closes the picker.
  const close = useCallback(() => toggleOpen(false), [toggleOpen])

  const Label = label == null ? 'div' : StyledLabel
  const hasError = errors.length !== 0 || isInvalid

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <DateTimePicker isOpened={isOpen}>

          {/* Date time input field. */}
          <DatePicker
            locale={de}
            selected={date}
            onChange={setDate}
            onCalendarClose={close}
            onClickOutside={close}
            open={isOpen}
            placeholderText={placeholder}
            className={className}
            popperPlacement={placement}
            dateFormat="dd.MM.yyyy HH:mm"
            timeCaption="Zeit"
            yearDropdownItemNumber={3}
            timeIntervals={15}
            shouldCloseOnSelect={false}
            showTimeSelect
            showMonthDropdown
            showYearDropdown
            showWeekNumbers
            isClearable
          />

          {/* Date time popup button. */}
          <PickerButton onClick={toggleOpen}>
            <UiIcon.Calendar />
          </PickerButton>

        </DateTimePicker>
      </InputAndErrorBox>
      <UiInputErrors errors={errors} />
    </Label>
  )
}

export default UiDateInput

const PickerButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  background: ${({ theme }) => theme.colors.primary.value};
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.primary.value};
  border-radius: 0 0.5rem 0.5rem 0;
  width: 60px;
  margin: 0;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary.contrast};

  transition: 250ms ease;
  transition-property: border-color;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.primary.hover};
  }
`

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

const DateTimePicker = styled.div<{ isOpened: boolean }>`
  width: 100%;
  height: 100%;
  margin-top: 0.25rem;
  display: flex;
  position: relative;

  .react-datepicker__input-container {
    position: relative;
  }

  // The date input clear button.
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

  // The datepicker popup container.
  .react-datepicker__portal,
  .react-datepicker-popper {

    .react-datepicker {
      background: white;
      color: ${({ theme }) => theme.colors.light.contrast};
      border-color: ${({ theme }) => theme.colors.primary.value};
      font-family: ${({ theme }) => theme.fonts.body};
      display: flex;
      margin: 0 0.2rem;

      .react-datepicker__triangle {
        left: 50% !important;
        transform: translateX(-50%) !important;

        &::before, &::after {
          border-bottom-color: ${({ theme }) => theme.colors.secondary.value};
          border-top-color: ${({ theme }) => theme.colors.secondary.value};
        }
      }

      // Month/year navigation elements.
      .react-datepicker__navigation {
        color: ${({ theme }) => theme.colors.light.contrast};

        &.react-datepicker__navigation--years {
          display: block;
          border-top: solid 2px ${({ theme }) => theme.colors.primary.value};
          border-left: solid 2px ${({ theme }) => theme.colors.primary.value};
          width: 10px;
          height: 10px;

          &:hover {
            border-top: solid 2px ${({ theme }) => theme.colors.primary.hover};
            border-left: solid 2px ${({ theme }) => theme.colors.primary.hover};
          }

          &.react-datepicker__navigation--months-upcoming,
          &.react-datepicker__navigation--years-upcoming {
            transform: rotate(45deg);
            margin-top: 0.5rem;
          }

          &.react-datepicker__navigation--months-previous,
          &.react-datepicker__navigation--years-previous {
            transform: rotate(225deg);
            margin-bottom: 0.5rem;
          }
        }

        &.react-datepicker__navigation--previous {
          left: 0;
        }

        &.react-datepicker__navigation--next {
          right: 90px;

          ${Themed.media.sm.max} {
            right: 0;
          }
        }

        .react-datepicker__navigation-icon {
          &::before {
            border-color: ${({ theme }) => theme.colors.primary.value};
            
          }
        }
      }

      .react-datepicker__header {
        background: ${({ theme }) => theme.colors.tertiary.value};
        color: ${({ theme }) => theme.colors.tertiary.contrast};
        border-color: ${({ theme }) => theme.colors.tertiary.value};

        ${Themed.media.sm.max} {
          border-top-right-radius: 0.3rem;
        }
      }

      // Elements containing month and day numbers.
      .react-datepicker__month-container {
        border-color: ${({ theme }) => theme.colors.primary.value};

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
          justify-content: center;
          align-items: center;

          .react-datepicker__month-dropdown-container {
            width: 40%;
          }

          .react-datepicker__year-dropdown-container {
            width: 30%;
          }

          .react-datepicker__year-dropdown-container,
          .react-datepicker__month-dropdown-container {
            position: relative;
            padding: 0;

            .react-datepicker__year-dropdown {
              left: auto;
              right: 0;
            }

            .react-datepicker__month-dropdown {
              left: 0;
            }

            .react-datepicker__year-dropdown,
            .react-datepicker__month-dropdown {
              position: relative;
              top: auto;
              width: 100%;
              height: 100%;
              padding: 0.2rem;
              margin: 0.1rem;
              background: white;
              border-color: ${({ theme }) => theme.colors.primary.value};

              .react-datepicker__month-option,
              .react-datepicker__year-option {
                padding: 0.1rem;

                &:hover {
                  background: ${({ theme }) => theme.colors.secondary.value};
                  color: ${({ theme }) => theme.colors.secondary.contrast};
                }
              }

              .react-datepicker__year-option:hover {

                &:first-child,
                &:last-child {
                  background: transparent;
                }
              }

              .react-datepicker__year-option--selected_year,
              .react-datepicker__month-option--selected_month {
                background: ${({ theme }) => theme.colors.primary.value};
                color: ${({ theme }) => theme.colors.primary.contrast};

                .react-datepicker__year-option--selected,
                .react-datepicker__month-option--selected {
                  display: none;
                }
              }
            }

            .react-datepicker__year-read-view,
            .react-datepicker__month-read-view {
              background: ${({ theme }) => theme.colors.light.value};
              color: ${({ theme }) => theme.colors.light.contrast};
              height: 100%;
              display: flex;
              justify-content: space-between;
              flex-direction: row-reverse;
              align-items: center;
              font-size: 10px;
              padding: 0.2rem;

              span {
                position: relative;
              }

              &:last-child {
                &:not(&:first-child) {
                  display: none;
                }

                &:first-child {
                  border-radius: 0;
                }
              }

              .react-datepicker__year-read-view--down-arrow,
              .react-datepicker__month-read-view--down-arrow {
                border-color: ${({ theme }) => theme.colors.light.contrast};
                right: auto;
                height: 6px;
                width: 6px;
                border-width: 1px 1px 0 0;
                margin: 0.2rem;
                transform: translateY(-30%) rotate(135deg);
              }
            }
          }
        }

        // Day names in the title row of the picker's calendar.
        .react-datepicker__day-names {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-evenly;

          .react-datepicker__day-name {
            line-height: 1.2;

            :first-child {
              ${Themed.media.xs.only} {
                display: none;
              }
            }
          }
        }

        // Day numbers and names.
        .react-datepicker__day-name,
        .react-datepicker__day {
          border-radius: 0.1rem;
          margin: 0;
          padding: calc(0.166rem + 0.5rem) calc(0.166rem + 1rem);
          line-height: 1;
          display: inline-flex;
          justify-content: center;
          align-items: center;

          ${Themed.media.xs.only} {
            padding: 0.55rem 1.05rem;
          }
        }

        // Month selection view.
        .react-datepicker__month {
          margin: 0;

          .react-datepicker__week {

            .react-datepicker__week-number {
              color: ${({ theme }) => theme.colors.grey.value};

              ${Themed.media.xs.only} {
                display: none;
              }
            }

            .react-datepicker__day {
              background: transparent;
              color: ${({ theme }) => theme.colors.light.contrast};
              border: 1px solid transparent;

              transition: 150ms ease;
              transition-property: background-color, color, border-color;

              &:hover:not(.react-datepicker__day--selected) {
                background: ${({ theme }) => theme.colors.secondary.value};
                color: ${({ theme }) => theme.colors.secondary.contrast};
              }

              &:focus:not(.react-datepicker__day--selected) {
                outline: none;
                border-color: ${({ theme }) => theme.colors.primary.value};
              }
            }

            .react-datepicker__day--selected {
              background: ${({ theme }) => theme.colors.primary.value};
              color: ${({ theme }) => theme.colors.primary.contrast};
              font-weight: bold;
            }

            .react-datepicker__day--outside-month {
              background: transparent;
              color: ${({ theme }) => theme.colors.secondary.value};
            }

            .react-datepicker__day--today {
              border: 2px solid ${({ theme }) => theme.colors.secondary.value};
            }
          }
        }
      }

      // The scrollable time column. 
      .react-datepicker__time-container {
        border-color: ${({ theme }) => theme.colors.primary.value};

        .react-datepicker-time__header {
        }

        .react-datepicker__time {

          .react-datepicker__time-box {
            background: white;
            color: ${({ theme }) => theme.colors.light.contrast};
            border-right: 1px solid ${({ theme }) => theme.colors.primary.value};

            .react-datepicker__time-list {

              .react-datepicker__time-list-item--selected {
                background: ${({ theme }) => theme.colors.primary.value};
                color: ${({ theme }) => theme.colors.primary.contrast};
                font-weight: bold;
              }

              .react-datepicker__time-list-item {
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 150ms ease;
                transition-property: background-color, color, font-weight;

                &:first-child {
                  margin-top: 1px;
                }

                &:last-child {
                  border-bottom-right-radius: 0.3rem;
                }

                &:hover:not(.react-datepicker__time-list-item--selected) {
                  background: ${({ theme }) => theme.colors.secondary.value};
                  color: ${({ theme }) => theme.colors.secondary.contrast};
                }
              }
            }
          }
        }
      }
    }
  }

  // Date input field.
  .react-datepicker__input-container > input {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.activeClosed.contrast};
    font-family: ${({ theme }) => theme.fonts.body};

    transition: 250ms ease;
    transition-property: border-color;

    // Button at the end of the input.
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: none;
  }

  // Button at the end of the input.
  > div:first-child {
    width: calc(100% - 60px);
  }

  ${({ isOpened }) => !isOpened && css`
    .react-datepicker__portal,
    .react-datepicker-popper {
      display: none;
    }
  `}
  ${Themed.media.sm.max} {
    .react-datepicker {
      max-width: 100%;
    }

    .react-datepicker__time-container {
      display: none;
    }
  }
`
