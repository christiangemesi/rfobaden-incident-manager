import { UiFormStateField } from '@/components/Ui/Form'
import React, { memo, ReactNode, useContext, useMemo } from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import UiModalContext from '@/components/Ui/Modal/Context/UiModalContext'
import { useUpdateEffect } from 'react-use'
import { usePersist } from '@/components/Ui/Persist/UiPersist'

interface Props<T, K extends keyof T> {
  field: UiFormStateField<T, K>
  deps?: unknown[]
  children: (inputProps: UiInputProps<T[K] | null>) => ReactNode
}

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

