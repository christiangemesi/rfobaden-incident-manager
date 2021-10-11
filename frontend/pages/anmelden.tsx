import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React from 'react'
import { useSession } from '@/stores/SessionStore'

const AnmeldenPage: React.VFC = () => {
  const { currentUser } = useSession()
  return (
    <UiContainer>
      <SessionForm />
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
export default AnmeldenPage