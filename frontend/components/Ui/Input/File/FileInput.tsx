import { UiInputProps } from '@/components/Ui/Input'
import React, { ChangeEvent, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props extends UiInputProps<File | null> {
  accept: string
}

const FileInput: React.VFC<Props> = ({
  accept,
  errors = [],
  value,
  onChange: setValue,
}) => {
  const [isDropReady, setDropReady] = useState(false)

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file != undefined) {
      setValue(file)
    }
  }, [setValue])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file != undefined) {
      setValue(file)
    }
  }, [setValue])

  const activateDrop = useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDropReady(true)
  }, [])

  const deactivateDrop = useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDropReady(false)
  }, [])

  return (
    <div>
      <StyledLabel
        onDrop={handleDrop}
        onDragStart={activateDrop}
        onDragOver={activateDrop}
        onDragEnter={activateDrop}
        onDragEnd={deactivateDrop}
        onDragLeave={deactivateDrop}
        isDropReady={isDropReady}
      >
        <UiIcon.Upload size={8} />
        <input type="file" accept={accept} onChange={handleChange} />
      </StyledLabel>

      {value?.name}
      <UiInputErrors errors={errors} />
    </div>
  )
}
export default FileInput

const StyledLabel = styled.label<{ isDropReady: boolean }>`
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;

  outline: 2px dashed #92b0b3;
  outline-offset: -10px;
  transition: outline-offset .15s ease-in-out, background-color .15s linear;

  & > input {
    display: none;
  }

  ${({ isDropReady }) => isDropReady && css`
    outline-offset: -20px;
  `}
`