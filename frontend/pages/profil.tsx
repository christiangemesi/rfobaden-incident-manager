import React, { useState } from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UserPasswordForm from '@/components/User/PasswordForm/UserPasswordForm'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import { run } from '@/utils/control-flow'
import UserEmailForm from '@/components/User/EmailForm/UserEmailForm'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'
import { useCurrentUser } from '@/stores/SessionStore'

const ProfilPage: React.VFC = () => {
  const [viewState, setViewState] = useState(ViewState.DEFAULT)

  const currentUser = useCurrentUser()

  return (
    <UiContainer>
      <h1>
        {currentUser.firstName} {currentUser.lastName}
      </h1>
      <UiGrid style={{ justifyContent: 'center' }}>
        {run(() => {
          switch (viewState) {
          case ViewState.CHANGE_EMAIL:
            return (
              <UiGrid.Col size={{ md: 8, lg: 5, xl: 3 }}>
                <UserEmailForm user={currentUser} onClose={() => setViewState(ViewState.DEFAULT)} />
              </UiGrid.Col>
            )
          case ViewState.CHANGE_PASSWORD:
            return (
              <UiGrid.Col size={{ md: 8, lg: 5, xl: 3 }}>
                <UserPasswordForm user={currentUser} onClose={() => setViewState(ViewState.DEFAULT)} />
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
  )
}
export default ProfilPage

enum ViewState {
  DEFAULT,
  CHANGE_PASSWORD,
  CHANGE_EMAIL,
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }
  return {
    props: {},
  }
}