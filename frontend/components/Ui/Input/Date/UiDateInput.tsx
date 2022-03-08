import React, { useState } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import styled, { css } from 'styled-components'
import DatePicker from 'react-datepicker'
import { de } from 'date-fns/locale'

import 'react-datepicker/dist/react-datepicker.css'
import 'rc-time-picker/assets/index.css'
import { Themed } from '@/theme'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props extends UiInputProps<Date | null> {
  label?: string
  labelTime?: string
  placeholder?: string
  className?: string
  isModal?: boolean
  placement?: 'top' | 'bottom'
}

const UiDateInput: React.VFC<Props> = ({
  value,
  label = '',
  labelTime = 'Zeit: ',
  placeholder = 'dd.MM.yyyy',
  placement = 'top',
  className,
  isModal = false,
  onChange: handleChange,
  errors = [],
}) => {

  const [date, setDate] = useState(value)
  const [isInvalid, setInvalid] = useState(false)
  const [isIconOpened, setIconOpened] = useState<boolean>(false)

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
  const hasError = errors.length !== 0 || isInvalid

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <DateTimePicker isModal={isModal} isOpened={isIconOpened}>
          <DatePicker
            locale={de}
            selected={date}
            onChange={setDate}
            onCalendarClose={() => setIconOpened(false)}
            placeholderText={placeholder}
            timeInputLabel={labelTime}
            className={className}
            popperClassName={className + ' dateTimePopupContainer'}
            dateFormat="dd.MM.yyyy HH:mm"
            popperPlacement={placement}
            yearDropdownItemNumber={3}
            timeIntervals={15}
            withPortal={isModal}
            shouldCloseOnSelect
            showTimeSelect
            showMonthDropdown
            showYearDropdown
            showWeekNumbers
            isClearable
            preventOpenOnFocus
          />
          <AdditionalInput isModal={isModal} onClick={() => setIconOpened(true)}>
            <UiIcon.Calendar />
          </AdditionalInput>
        </DateTimePicker>
      </InputAndErrorBox>
      <UiInputErrors errors={errors} />
    </Label>
  )
}

export default UiDateInput

const PickerButton = styled.button.attrs(() => ({
  type: 'button',
}))<{ isModal: boolean }>`
  background: ${({ theme }) => theme.colors.primary.value};
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
  border-radius: 0 0.5rem 0.5rem 0;
  width: 60px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary.contrast};
  cursor: pointer;

  transition: 250ms ease;
  transition-property: border-color;

  ${Themed.media.sm.max} {
    ${({ isModal }) => isModal && css`
      display: none;
    `}
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

const DateTimePicker = styled.div<{ isModal: boolean, isOpened: boolean }>`
  width: 100%;
  height: 100%;
  margin-top: 0.25rem;
  display: flex;
  position: relative;

  .react-datepicker__input-container {
    position: relative;
  }

  .react-datepicker__input-container > input {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
    font-family: ${({ theme }) => theme.fonts.body};
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: none;

    transition: 250ms ease;
    transition-property: border-color;
  }

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

  .react-datepicker__portal,
  .react-datepicker-popper {

    .react-datepicker {
      background: white;
      color: ${({ theme }) => theme.colors.tertiary.contrast};
      border-color: ${({ theme }) => theme.colors.primary.value};
      font-family: ${({ theme }) => theme.fonts.body};
      display: flex;

      .react-datepicker__triangle {
        left: 50% !important;
        transform: translateX(-50%) !important;

        &::before, &::after {
          border-bottom-color: ${({ theme }) => theme.colors.secondary.value};
          border-top-color: ${({ theme }) => theme.colors.secondary.value};
        }
      }

      .react-datepicker__navigation {
        color: ${({ theme }) => theme.colors.tertiary.contrast};

        &.react-datepicker__navigation--years {
          display: block;
          border-top: solid 2px ${({ theme }) => theme.colors.primary.value};
          border-left: solid 2px ${({ theme }) => theme.colors.primary.value};
          width: 10px;
          height: 10px;

          &:hover {
            filter: brightness(130%);
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
        background: ${({ theme }) => theme.colors.secondary.value};
        color: ${({ theme }) => theme.colors.secondary.contrast};
        border-color: ${({ theme }) => theme.colors.secondary.value};

        ${Themed.media.sm.max} {
          border-top-right-radius: 0.3rem;
        }
      }

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
              background: ${({ theme }) => theme.colors.tertiary.value};
              color: ${({ theme }) => theme.colors.tertiary.contrast};
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
        }

        .react-datepicker__day-names {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-evenly;

          .react-datepicker__day-name {
            line-height: 1.2;
            padding: 0.2rem 0.5rem;
          }
        }

        .react-datepicker__day-name,
        .react-datepicker__day {
          border-radius: 0.1rem;
          padding: 0.5rem 1rem;
          line-height: 1;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        .react-datepicker__month {
          margin: 0;

          .react-datepicker__week {

            .react-datepicker__week-number {
              color: ${({ theme }) => theme.colors.grey.value};
            }

            .react-datepicker__day {
              background: transparent;
              color: ${({ theme }) => theme.colors.tertiary.contrast};
              border: 1px solid transparent;

              &:hover {
                background: ${({ theme }) => theme.colors.secondary.value};
                color: ${({ theme }) => theme.colors.secondary.contrast};
              }

              &:focus {
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

      .react-datepicker__time-container {
        border-color: ${({ theme }) => theme.colors.primary.value};


        .react-datepicker-time__header {

        }

        .react-datepicker__time {
            //border-color: ${({ theme }) => theme.colors.primary.value};

          .react-datepicker__time-box {
            background: white;
            color: ${({ theme }) => theme.colors.tertiary.contrast};
            border-right: 1px solid ${({ theme }) => theme.colors.primary.value};

            .react-datepicker__time-list {

              .react-datepicker__time-list-item--selected {
                background: ${({ theme }) => theme.colors.primary.value};
                color: ${({ theme }) => theme.colors.primary.contrast};
                font-weight: bold;
              }

              .react-datepicker__time-list-item {
                &:first-child {
                  margin-top: 1px;
                }

                &:last-child {
                  border-bottom-right-radius: 0.3rem;
                }

                &:hover {
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

  // for additional input
  > div:first-child {
    width: calc(100% - 60px);

    ${Themed.media.sm.max} {
      ${({ isModal }) => isModal && css`
        width: 100%;
      `}
    }
  }

  // for additional input
  input.dateTimeInput {
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: none;

    ${Themed.media.sm.max} {
      ${({ isModal }) => isModal && css`
        border-radius: 0.5rem;
        border-right: solid 1px;
      `}
    }
  }

  // function of calender icon
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

    .react-datepicker__portal {
      ${({ isModal }) => isModal && css`
        display: none;
      `}
    }
  }
`
