import React, { ReactNode, useMemo, useState } from 'react'
import UiModalContext, {
  animationMillis,
  UiModalState,
  UiModalVisibility,
} from '@/components/Ui/Modal/Context/UiModalContext'
import UiModalActivator from '@/components/Ui/Modal/Activator/UiModalActivator'
import UiModalBody from '@/components/Ui/Modal/Body/UiModalBody'
import { useUpdateEffect } from 'react-use'

interface Props {
  /**
   * Make the modal take up a fixed, full size.
   */
  isFull?: boolean

  /**
   * Make the modal persistent, meaning it can't be closed by
   * clicking outside the modal window.
   */
  isPersistent?: boolean

  children: ReactNode
}

const UiModal: React.VFC<Props> = ({
  isFull = false,
  isPersistent: isPersistentProp = false,
  children,
}) => {
  const [visibility, setVisibility] = useState(UiModalVisibility.CLOSED)
  const [isPersistent, setPersistent] = useState(isPersistentProp)

  const context: UiModalState = useMemo(() => {
    const isOpen = visibility === UiModalVisibility.OPEN || visibility === UiModalVisibility.OPENING
    const close = () => {
      setVisibility(UiModalVisibility.CLOSING)
      setTimeout(() => {
        setVisibility(UiModalVisibility.CLOSED)
      }, animationMillis)
    }
    const open = () => {
      setVisibility(UiModalVisibility.OPENING)
      setTimeout(() => {
        setVisibility(UiModalVisibility.OPEN)
      }, animationMillis)
    }
    return {
      isFull,
      visibility,
      isOpen,
      close,
      open,
      toggle() {
        if (this.isOpen) {
          close()
        } else {
          open()
        }
      },
      isPersistent,
      setPersistent,
      persist: () => setPersistent(true),
    }
  }, [isFull, isPersistent, visibility])

  useUpdateEffect(() => {
    if (!context.isOpen) {
      context.setPersistent(false)
    }
  }, [context.isOpen])

  return (
    <UiModalContext.Provider value={context}>
      {children}
    </UiModalContext.Provider>
  )
}
export default Object.assign(UiModal, {
  Activator: UiModalActivator,
  Body: UiModalBody,
})
