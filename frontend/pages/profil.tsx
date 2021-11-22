import React, { useState } from 'react'
import SessionOnly from '@/components/Session/Only/SessionOnly'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UserPasswordForm from '@/components/User/PasswordForm/UserPasswordForm'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import { run } from '@/utils/control-flow'
import UserEmailForm from '@/components/User/EmailForm/UserEmailForm'

const ProfilPage: React.VFC = () => {
  const [viewState, setViewState] = useState(ViewState.DEFAULT)

  return (
    <SessionOnly doRedirect>{({ currentUser: user }) => (
      <UiContainer>
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <UiGrid style={{ justifyContent: 'center' }}>
          {run(() => {
            switch (viewState) {
            case ViewState.CHANGE_EMAIL:
              return (
                <UiGrid.Col size={{ md: 8, lg: 5, xl: 3 }}>
                  <UserEmailForm user={user} onClose={() => setViewState(ViewState.DEFAULT)} />
                </UiGrid.Col>
              )
            case ViewState.CHANGE_PASSWORD:
              return (
                <UiGrid.Col size={{ md: 8, lg: 5, xl: 3 }}>
                  <UserPasswordForm user={user} onClose={() => setViewState(ViewState.DEFAULT)} />
                </UiGrid.Col>
              )
            case ViewState.DEFAULT:
              return (
                <UiGrid.Col>
                  <UiGrid gap={1} style={{ justifyContent: 'center' }}>
                    <UiGrid.Col size="auto">
                      <UiButton onClick={() => setViewState(ViewState.CHANGE_EMAIL)}>
                        E-Mail ändern
                      </UiButton>
                    </UiGrid.Col>
                    <UiGrid.Col size="auto">
                      <UiButton onClick={() => setViewState(ViewState.CHANGE_PASSWORD)}>
                        Passwort ändern
                      </UiButton>
                    </UiGrid.Col>
                  </UiGrid>
                </UiGrid.Col>
              )
            }
          })}
        </UiGrid>
      </UiContainer>
    )}</SessionOnly>
  )
}
export default ProfilPage

enum ViewState {
  DEFAULT,
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
}