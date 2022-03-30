import { UiInputProps } from '@/components/Ui/Input'
import React, { ChangeEvent, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import UiIcon from '@/components/Ui/Icon/UiIcon'

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

      <StyledForm>

        <input type="file" onChange={handleChange} />
        <UiIcon.Upload size={8} />

      </StyledForm>
      {value?.name}
      <UiInputErrors errors={errors} />
    </div>
  )
}
export default FileInput

//TODO do some css styling
//TODO drag and drop


const StyledForm = styled.form`
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;

  outline: 2px dashed #92b0b3;
  outline-offset: -10px;
  -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
  transition: outline-offset .15s ease-in-out, background-color .15s linear;


  & > input {
    display: none;
  }

  :hover {
    background-color: white;
    outline-offset: -20px;
  }
`





