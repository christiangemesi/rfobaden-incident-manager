import React, { useMemo } from 'react'
import Select, { components, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'
import { contrastDark, defaultTheme } from '@/theme'
import { useMountedState } from 'react-use'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'

interface Props<T> extends UiInputProps<T | null> {
  label?: string
  options: T[]
  optionName?: keyof T | ((option: T) => string | null)
  onCreate?: (value: string) => void
  isCreatable?: boolean,
  isDisabled?: boolean,
  isSearchable?: boolean,
  placeholder?: string,
  menuPlacement?: 'auto' | 'top' | 'bottom'
  onTrashClick?: (value: T) => void
}

const UiSelectInput = <T, >({
  value = null,
  onChange: setValue,
  errors,
  label,
  options,
  optionName,
  onCreate: handleCreate,
  isCreatable = false,
  isDisabled = false,
  isSearchable = false,
  placeholder = '',
  menuPlacement = 'auto',
  onTrashClick: handleTrashClick,
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

  const hasErrors = errors && errors.length > 0

  const customStyles: StylesConfig<Option<T>, false> = {
    // style of main select box
    control: (styles, { isFocused }) => ({
      ...styles,
      borderRadius: '0.5rem',
      marginBottom: 0,
      marginTop: '0.25rem',

      boxShadow: 'none',
      borderColor: hasErrors ? defaultTheme.colors.error.value : (isFocused ? defaultTheme.colors.primary.value : contrastDark),
      color: contrastDark,

      ':hover': {
        borderColor: hasErrors ? defaultTheme.colors.error.value : (isFocused ? defaultTheme.colors.primary.value : contrastDark),
      },
    }),
    // style of option container
    menu: (styles) => ({
      ...styles,
      borderRadius: '0.5rem',
      marginTop: 2,
      marginBottom: 0,
    }),
    // style of option element
    option: (styles, { isDisabled, isSelected }) => {
      return {
        ...styles,
        color: isSelected ? defaultTheme.colors.primary.contrast : contrastDark,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: isSelected ? defaultTheme.colors.primary.value : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        ':disabled': {
          ...styles[':disabled'],
          backgroundColor: 'rgb(200,200,200)',
          filter: 'brightness(120%)',
        },

        'div': {
          display: 'none',
          ':hover': {
            display: 'block',
          },
        },

        ':hover': {
          ...styles[':hover'],
          backgroundColor: defaultTheme.colors.secondary.value,
          color: defaultTheme.colors.secondary.contrast,
        },
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
      color: 'rgb(150,150,150)',
    }),
    // style of current shown value in select
    singleValue: (styles) => ({
      ...styles,
    }),
  }

  const Label = label == null ? 'div' : StyledLabel

  const isMounted = useMountedState()
  if (!isMounted()) {
    return <React.Fragment />
  }

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      {isCreatable ? (
        <CreatableSelect
          options={mappedOptions}
          value={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
          onCreateOption={handleCreate}
          isClearable
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          styles={customStyles}
          menuPlacement={menuPlacement}
          components={{
            Option: (props) => (
              <components.Option {...props}>
                {props.label}
                {handleTrashClick !== undefined && (
                  <TrashButton onClick={(e) => {
                    e.stopPropagation()
                    handleTrashClick(props.data.value)
                  }}>
                    <UiIcon.Trash size={0.7} />
                  </TrashButton>
                )}
              </components.Option>
            ),
          }}
          // eslint-disable-next-line react/no-unescaped-entities
          formatCreateLabel={(inputValue) => <span>"{inputValue}" hinzufügen</span>}
        />
      ) : (
        <Select
          options={mappedOptions}
          value={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
          isClearable
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          styles={customStyles}
          menuPlacement={menuPlacement}
        />
      )
      }
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

const TrashButton = styled(UiIconButton)`

  :hover {
    background-color: transparent;
    transform: scale(1.2);
  }
`
