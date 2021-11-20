import React, { ReactNode } from 'react'
import { useAsync } from 'react-use'
import SessionStore from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import User from '@/models/User'
import { useStore } from '@/stores/Store'

interface Props {
  doRedirect?: boolean
  children?: (session: { currentUser: User }) => ReactNode
}

/**
 * Renders children only if there's currently an active session.
 */
const SessionOnly: React.VFC<Props> = ({
  doRedirect = false,
  children,
}) => {
  const session = useStore(SessionStore).session

  const router = useRouter()
  useAsync(async () => {
    if (session !== null && session.currentUser === null && doRedirect) {
      await router.push('/anmelden')
    }
  }, [doRedirect, session])

  if (session?.currentUser == null) {
    return <React.Fragment />
  }
  return (
    <React.Fragment>
      {children && children({ currentUser: session.currentUser })}
    </React.Fragment>
  )
}
export default SessionOnly
