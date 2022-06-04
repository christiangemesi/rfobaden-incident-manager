import { UiFormStateField } from '@/components/Ui/Form'
import React, { memo, ReactNode, useMemo } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import { useUpdateEffect } from 'react-use'
import { usePersist } from '@/components/Ui/Persist/UiPersist'

interface Props<T, K extends keyof T> {
  /**
   * The form field whose value is handled.
   */
  field: UiFormStateField<T, K>

  /**
   * Values which should cause re-renders when changed.
   * <p>
   *   The {@link UiFormField} component is memoized and does by default only re-render when the
   *   {@link field} changes. These `deps` add further values which can cause such re-renders.
   * </p>
   */
  deps?: unknown[]

  /**
   * A function rendering the input element.
   *
   * @param inputProps The props defining what the input should display.
   */
  children: (inputProps: UiInputProps<T[K] | null>) => ReactNode
}

/**
 * `UiFormField` is a component providing utilities to easily handle form inputs.
 */
const UiFormField = <T, K extends keyof T>({
  field,
  children,
}: Props<T, K>): JSX.Element => {
  const { value, setValue, hasChanged, errors } = field

  // Persist the current context.
  // This is mainly used to signal to parent modals/drawers etc. that something has changed.
  const persist = usePersist()
  useUpdateEffect(() => {
    if (hasChanged) {
      persist()
    }
  }, [hasChanged])

  const child = useMemo(() => children({
    value,
    errors: hasChanged ? errors : [],
    onChange: (newValue) => {
      setValue(newValue as T[K])
    },
  }), [children, value, hasChanged, errors, setValue])

  return (
    <React.Fragment>
      {child}
    </React.Fragment>
  )
}

// Memoize the component, so changes to other form field values
// do not cause performance issues.
export default memo(UiFormField, (prev, next) => {
  if (prev.field !== next.field) {
    return false
  }

  if (prev.deps === next.deps) {
    return true
  }
  const prevDeps = prev.deps ?? []
  const nextDeps = next.deps ?? []
  if (prevDeps.length !== nextDeps.length) {
    return false
  }
  for (let i = 0; i < prevDeps.length; i++) {
    if (prevDeps[i] !== nextDeps[i]) {
      return false
    }
  }
  return true
}) as unknown as typeof UiFormField

