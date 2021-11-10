import React, { ReactNode } from 'react'
import { useAsync } from 'react-use'
import { useSession } from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import User from '@/models/User'

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
  const { currentUser } = useSession()

  const router = useRouter()
  useAsync(async () => {
    if (currentUser === null && doRedirect) {
      await router.push('/anmelden')
    }
  }, [doRedirect, currentUser])

  if (currentUser === null) {
    return <React.Fragment />
  }
  return (
    <React.Fragment>
      {children && children({ currentUser })}
    </React.Fragment>
  )
}
export default SessionOnly
