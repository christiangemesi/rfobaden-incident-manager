import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

const UserForm: React.VFC = () => {
  const [ name, setName ] = useState('')
  const handleChange = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value
    setName(value)
  }

  return (
    <div>
      <h1>
        Benutzer erstellen
      </h1>
      <form>
        <div>
          <label>
            Name<br />
            <input type="text" name="name" value={name} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Passwort<br />
            <input type="password" name="password" />
          </label>
        </div>
        <div>
          <label>
            Passwort wiederholen<br />
            <input type="password" name="passwordRepeat" />
          </label>
        </div>
        <SubmitButton type="button">
          Bestätigen
        </SubmitButton>
      </form>
    </div>
  )
}
export default UserForm

const SubmitButton = styled.button`
  background-color: green;
  color: white;
  padding: 1rem 0.5rem;  
`
