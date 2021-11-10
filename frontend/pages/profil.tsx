import React from 'react'
import SessionOnly from '@/components/Session/Only/SessionOnly'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { useToggle } from 'react-use'
import UserPasswordForm from '@/components/User/PasswordForm/UserPasswordForm'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'

const ProfilPage: React.VFC = () => {
  const [showPasswordForm, togglePasswordForm] = useToggle(false)
  return (
    <SessionOnly>{({ currentUser: user }) => (
      <UiContainer >
        <h1>
          {user.firstName} {user.lastName}
        </h1>

        <UiGrid style={{ justifyContent: 'center' }}>
          {showPasswordForm ? (
            <UiGrid.Col size={{ md: 8, lg: 5, xl: 3 }}>
              <UserPasswordForm user={user} onClose={togglePasswordForm} />
            </UiGrid.Col>
          ) : (
            <UiButton onClick={togglePasswordForm}>
              Passwort ändern
            </UiButton>
          )}
        </UiGrid>
      </UiContainer>
    )}</SessionOnly>
  )
}
export default ProfilPage
