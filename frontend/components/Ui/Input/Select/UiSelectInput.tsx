import React, { useMemo } from 'react'
import Select, { StylesConfig } from 'react-select'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'
import { defaultTheme, contrastDark } from '@/theme'

interface Props<T> extends UiInputProps<T | null> {
  label?: string
  options: T[]
  optionName?: keyof T | ((option: T) => string | null)
  isDisabled?: boolean,
  isSearchable?: boolean,
  placeholder?: string,
}

const UiSelectInput = <T, >({
  value = null,
  onChange: setValue,
  errors,
  label,
  options,
  optionName,
  isDisabled = false,
  isSearchable = false,
  placeholder = '',
}: Props<T>): JSX.Element => {
  const optionToLabel = useOptionAttribute(optionName)
  const mappedOptions: Option<T>[] = useMemo(() => (
    options.map((option) => {
      return { value: option, label: optionToLabel(option) ?? '' }
    })
  ), [optionToLabel, options])

  const defaultValue = useMemo(() => (
    value === null ? null : { value, label: optionToLabel(value) ?? '' }
  ), [optionToLabel, value])

  const handleChange = (option: Option<T> | null) => {
    if (setValue) {
      setValue(option?.value ?? null)
    }
  }

  const Label = label == null ? 'div' : StyledLabel

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <Select
        options={mappedOptions}
        value={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        isClearable={true}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        styles={customStyles}
      />
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiSelectInput

interface Option<T> {
  value: T
  label: string
}

type OptionAttribute<T> =
  | undefined
  | keyof T
  | ((option: T) => string | null)

const useOptionAttribute = <T, >(attr: OptionAttribute<T>): (option: T) => string | null => {
  return useMemo(() => {
    if (attr === undefined) {
      return (option) => {
        if (typeof option === 'string') {
          return option
        }
        throw new Error(`option is not a string nor a number: ${option}`)
      }
    }
    if (typeof attr === 'function') {
      return attr
    }
    return (option) => {
      const value = option[attr]
      if (typeof value === 'string') {
        return value
      }
      throw new Error(`option value '${option}' is not a string nor a number: ${value}`)
    }
  }, [attr])
}
const customStyles: StylesConfig<string> = {
  // style of main select box
  control: (styles, { isFocused }) => ({
    ...styles,
    borderRadius: '0.5rem',
    marginBottom: 0,
    marginTop: '0.25rem',

    boxShadow: isFocused ? '0 0 0 1px ' + defaultTheme.colors.primary.value : 'none',
    borderColor: isFocused ? defaultTheme.colors.primary.value : 'rgb(200,200,200)',
  }),
  // style of option container
  menu: (styles) => ({
    ...styles,
    borderRadius: '0.5rem',
    marginTop: 2,
  }),
  // style of option element
  option: (styles, { isDisabled, isSelected }) => {
    return {
      ...styles,
      color: isSelected ? defaultTheme.colors.primary.contrast : contrastDark,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isSelected ? defaultTheme.colors.primary.value : 'none',

      ':disabled': {
        ...styles[':disabled'],
        backgroundColor: 'rgb(200,200,200)',
        filter: 'brightness(120%)',
      },

      ':hover': {
        ...styles[':hover'],
        backgroundColor: defaultTheme.colors.secondary.value,
        color: defaultTheme.colors.secondary.contrast,
      },
      //
      // ':active': {
      //   ...styles[':active'],
      // },
    }
  },
  // style of input field in main select with search input
  input: (styles) => ({
    ...styles,
    color: contrastDark,
  }),
  // style placeholder in main select
  placeholder: (styles) => ({
    ...styles,
  }),
  // style of current shown value in select
  singleValue: (styles) => ({
    ...styles,
  }),
}

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