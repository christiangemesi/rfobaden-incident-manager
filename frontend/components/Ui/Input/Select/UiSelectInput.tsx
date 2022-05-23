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
  /**
   * Text of the input label.
   */
  label?: string

  /**
   * The values which can be selected.
   */
  options: T[]

  /**
   * The key of a {@link options} property whose value is displayed,
   * or a function which maps each option to a value which can be displayed.
   */
  optionName?: keyof T | ((option: T) => string | null)

  /**
   * Disables the checkbox.
   */
  isDisabled?: boolean,

  /**
   * Whether the select options can be searched.
   */
  isSearchable?: boolean,

  /**
   * Text of the input placeholder.
   */
  placeholder?: string,

  /**
   * Placement of the select dropdown.
   */
  menuPlacement?: 'auto' | 'top' | 'bottom'

  /**
   * Function triggered by the creation of an option.
   *
   * @param value The value of the option to create.
   */
  onCreate?: (value: string) => void

  /**
   * Function triggered by the deletion of an option.
   *
   * @param value The option to delete.
   */
  onDelete?: (value: T) => void
}

/**
 * `UiSelectInput` is an input component for displaying a range of options.
 * It offers the user to choose one option out of many.
 */
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
  menuPlacement = 'auto',
  onCreate: handleCreate,
  onDelete: handleDelete,
}: Props<T>): JSX.Element => {

  // Prepare the displayed option names
  const optionToLabel = useOptionAttribute(optionName)
  const mappedOptions: Option<T>[] = useMemo(() => (
    options.map((option) => {
      return { value: option, label: optionToLabel(option) ?? '' }
    })
  ), [optionToLabel, options])

  // Prepare value and handle
  const defaultValue = useMemo(() => (
    value === null ? null : { value, label: optionToLabel(value) ?? '' }
  ), [optionToLabel, value])

  const handleChange = (option: Option<T> | null) => {
    if (setValue) {
      setValue(option?.value ?? null)
    }
  }

  const hasErrors = errors && errors.length > 0

  // Style the React select input component
  const customStyles: StylesConfig<Option<T>, false> = {
    // Main select box
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
    // Option container
    menu: (styles) => ({
      ...styles,
      borderRadius: '0.5rem',
      marginTop: 2,
      marginBottom: 0,
    }),
    // Option item
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
    // Input field in main select with search input
    input: (styles) => ({
      ...styles,
      color: contrastDark,
    }),
    // Placeholder in main select
    placeholder: (styles) => ({
      ...styles,
      color: 'rgb(150,150,150)',
    }),
    // Current shown value in select
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
      {handleCreate !== undefined ? (
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
            // Customize option item
            Option: (props) => (
              <components.Option {...props}>
                {props.label}
                {handleDelete !== undefined && (
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(props.data.value)
                  }}>
                    <UiIcon.Trash size={0.7} />
                  </DeleteButton>
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

/**
 * {@code useOptionAttribute} is a React hook which prepares
 * the option label mapping function.
 * It re-renders whenever the option attributes is changed.
 *
 * @param attr The option name mapping function.
 * @return A mapping function with an option parameter and a string return
 */
const useOptionAttribute = <T, >(attr: OptionAttribute<T>): (option: T) => string | null => {
  return useMemo(() => {

    // Use option as function return
    if (attr === undefined) {
      return (option) => {
        if (typeof option === 'string') {
          return option
        }
        throw new Error(`option is not a string nor a number: ${option}`)
      }
    }

    // Use function from arguments
    if (typeof attr === 'function') {
      return attr
    }

    // Use option value as function return
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

const DeleteButton = styled(UiIconButton)`
  :hover {
    background-color: transparent;
    transform: scale(1.2);
  }
`
