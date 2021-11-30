import React, { useMemo } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'

interface Props<T> extends UiInputProps<T | null> {
  label?: string
  options: T[]
  optionName?: keyof T | ((option: T) => string | null)
}

const UiSelectInput = <T, >({
  value = null,
  onChange: setValue,
  errors,
  label,
  options,
  optionName,
}: Props<T>): JSX.Element => {
  const optionToLabel = useOptionAttribute(optionName)
  const mappedOptions: Option<T>[] = useMemo(() => (
    options.map((option) => {
      return { value: option, label: optionToLabel(option) ?? '' }
    })
  ), [optionToLabel, options])

  const defaultValue = useMemo(()=>(
    value === null ? null : { value, label: optionToLabel(value) ?? '' }
  ), [optionToLabel, value])

  const handleChange = (e: Option<T> | null) => {
    if (setValue) {
      setValue(e?.value ?? null)
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
        onChange={handleChange}
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

//   const getOptionValue = useOptionAttribute(optionValue)
//   const getOptionName = useOptionAttribute(optionName)
//
//   const optionMapping: Map<string, T> = useMemo(() => {
//     const mapping = new Map<string, T>()
//     for (const option of options) {
//       const optionValue = getOptionValue(option)
//       if (optionValue === null) {
//         throw new Error(`option has no value: ${option}`)
//       }
//       const key = `${optionValue}`
//       if (mapping.has(key)) {
//         throw new Error(`duplicate option value: ${optionValue}`)
//       }
//       mapping.set(key, option)
//     }
//     return mapping
//   }, [options, getOptionValue])
//
//   const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
//     const optionValue = e.target.value
//     if (optionValue.length === 0) {
//       // Default, empty option. Set the value to null.
//       if (setValue) {
//         setValue(null as unknown as T)
//       }
//       return
//     }
//     const option = optionMapping.get(optionValue)
//     if (option === undefined) {
//       throw new Error(`unknown option value: ${optionValue}`)
//     }
//     if (setValue) {
//       setValue(option)
//     }
//   }, [optionMapping, setValue])
//
//   const Label = label == null ? 'div' : StyledLabel
//


