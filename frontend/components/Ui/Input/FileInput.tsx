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
  
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
  
 
  border: 0.4rem dashed red;
  
  & > input {
    display:none;
  }
`





