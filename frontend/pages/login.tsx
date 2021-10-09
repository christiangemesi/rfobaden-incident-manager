import UiContainer from '@/components/Ui/Container/UiContainer'
import LoginForm from '@/components/Login/Form/LoginForm'
import React from 'react'
import { useSession } from '@/stores/SessionStore'

const LoginPage: React.VFC = () => {
  const { currentUser } = useSession()
  return (
    <UiContainer>
      <LoginForm />
      {currentUser === null ? (
        'not logged in'
      ) : (
        <React.Fragment>
          logged in as {currentUser.name}
        </React.Fragment>
      )}
    </UiContainer>
  )
}
export default LoginPage