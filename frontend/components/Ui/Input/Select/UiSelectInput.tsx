import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { UiFormInputProps } from '@/components/Ui/Form/Field/UiFormField'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props<T> extends UiFormInputProps<T | null> {
  label?: string
  options: T[]
  optionValue?: keyof T | ((option: T) => string | number | null)
  optionName?: keyof T | ((option: T) => string | number | null)
}

const UiSelectInput = <T,>({
  value = null,
  onChange: setValue,
  errors,
  label,
  options,
  optionValue,
  optionName,
}: Props<T>): JSX.Element => {
  const getOptionValue = useOptionAttribute(optionValue)
  const getOptionName = useOptionAttribute(optionName)

  const optionMapping: Map<string, T> = useMemo(() => {
    const mapping = new Map<string, T>()
    for (const option of options) {
      const optionValue = getOptionValue(option)
      if (optionValue === null) {
        throw new Error(`option has no value: ${option}`)
      }
      const key = `${optionValue}`
      if (mapping.has(key)) {
        throw new Error(`duplicate option value: ${optionValue}`)
      }
      mapping.set(key, option)
    }
    return mapping
  }, [options, getOptionValue])

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const optionValue = e.target.value
    if (optionValue.length === 0) {
      // Default, empty option. Set the value to null.
      if (setValue) {
        setValue(null as unknown as T)
      }
      return
    }
    const option = optionMapping.get(optionValue)
    if (option === undefined) {
      throw new Error(`unknown option value: ${optionValue}`)
    }
    if (setValue) {
      setValue(option)
    }
  }, [optionMapping, setValue])

  const Label = label == null ? 'div' : StyledLabel

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <StyledSelect
        value={value === null ? undefined : getOptionValue(value) ?? undefined}
        onChange={handleChange}
      >
        <option />
        {[...optionMapping.entries()].map(([optionValue, option]) => (
          <option key={optionValue} value={optionValue}>
            {getOptionName(option)}
          </option>
        ))}
      </StyledSelect>
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiSelectInput

type OptionAttribute<T> =
  | undefined
  | keyof T
  | ((option: T) => string | number | null)

const useOptionAttribute = <T,>(attr: OptionAttribute<T>): (option: T) => string | number | null => {
  return useMemo(() => {
    if (attr === undefined) {
      return (option) => {
        if (typeof option === 'string' || typeof option == 'number') {
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
      if (typeof value === 'string' || typeof value == 'number') {
        return value
      }
      throw new Error(`option value '${option}' is not a string nor a number: ${value}`)
    }
  }, [attr])
}

const StyledSelect = styled.select`
  padding: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  outline: none;
  
  border: 1px solid gray;
  :active, :focus {
    border-color: cornflowerblue;
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

