import React from 'react'
import styled from 'styled-components'

interface Props {
  errors?: string[]
}

const UiInputErrors: React.VFC<Props> = ({
  errors = [],
}) => {
  return (
    <Errors>
      {errors.map((error) => (
        <div key={error}>
          {error}
        </div>
      ))}
    </Errors>
  )
}
export default UiInputErrors

const Errors = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: red;
  font-size: 0.9rem;
`
