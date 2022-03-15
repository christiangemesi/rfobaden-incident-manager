import React, { ReactNode, useMemo } from 'react'
import { useAsync } from 'react-use'
import SessionStore from '@/stores/SessionStore'
import { useRouter } from 'next/router'
import User from '@/models/User'
import { useStore } from '@/stores/base/hooks'

interface Props {
  doRedirect?: boolean
  children?: ReactNode | ((session: { currentUser: User }) => ReactNode)
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

  const childComponent = useMemo(() => {
    if (session?.currentUser == null) {
      return <React.Fragment />
    }
    if (typeof children === 'function') {
      return children({ currentUser: session.currentUser })
    }
    return children
  }, [children, session])

  return (
    <React.Fragment>
      {childComponent}
    </React.Fragment>
  )
}
export default SessionOnly
