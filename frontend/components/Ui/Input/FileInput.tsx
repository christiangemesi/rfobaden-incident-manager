import { UiInputProps } from '@/components/Ui/Input'
import React, { ChangeEvent, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'


type Props = UiInputProps<File | null>

const FileInput: React.VFC<Props> = ({
  onChange: setValue,
  errors = [],
  value,

}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file != undefined) {
      setValue(file)
      console.log('Uploaded :' + file.name)
    }
  }, [setValue])

  return (
    <div>
      <StyledLabel>
        <input type="file" onChange={handleChange} />

      </StyledLabel>
      {value?.name}
      <UiInputErrors errors={errors} />
    </div>
  )
}

export default FileInput

//TODO do some css styling
//TODO drag and drop
const StyledLabel = styled.label`
  width: 100%;
  height: 3rem;
  background-color: red;
  display: block;
  
  & > input {
    display:none;
  }
`
