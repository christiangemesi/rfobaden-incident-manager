import { UiInputProps } from '@/components/Ui/Input'
import React, { ChangeEvent, ReactNode, useCallback } from 'react'


interface Props extends UiInputProps<string | null> {
  label?: string
  type?: 'file'
  placeholder?: string
  children?: ReactNode
  onClick?: () => void
}

const FileInput: React.VFC<Props> = ({
  onChange: setValue,


}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file != undefined) {
      console.log('Uploaded :' + file.name)
    }

    if (setValue) {
      const newValue = e.target.value
      if (newValue.length === 0) {
        setValue(null)
      } else {
        setValue(newValue)
      }
    }
  }, [setValue])

  return (
    <form>
      <input type="file" name="picture" onChange={handleChange} />
      <button> Submit</button>
    </form>
  )
}

export default FileInput

