import Incident, { parseIncident } from '@/models/Incident'
import Id from '@/models/base/Id'
import React from 'react'
import { GetServerSideProps } from 'next'
import BackendService from '@/services/BackendService'
import UiContainer from '@/components/Ui/Container/UiContainer'
import User, { parseUser } from '@/models/User'
import IncidentView from '@/components/Incident/View/IncidentView'
import IncidentStore, { useIncident } from '@/stores/IncidentStore'
import UserStore from '@/stores/UserStore'
import { useEffectOnce } from 'react-use'

interface Props {
  id: Id<Incident>
  data: {
    incident: Incident
    author: User | null
  }
}

const EreignisPage: React.VFC<Props> = ({ id, data }) => {
  useEffectOnce(() => {
    IncidentStore.save(parseIncident(data.incident))
    if (data.author) {
      UserStore.save(parseUser(data.author))
    }
  })

  const incident = useIncident(id)
  return (
    <UiContainer>
      {incident !== null && (
        <IncidentView incident={incident} />
      )}
    </UiContainer>
  )
}
export default EreignisPage


export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const id = parseInt(query.id as string) as Id<Incident>
  const [incident, error] = await BackendService.find<Incident>('incidents', id)
  if (error !== null) {
    if (error.status === 404) {
      return {
        notFound: true,
      }
    }
    throw error
  }
  const [author, authorError] = await BackendService.find<User | null>('users', incident.authorId)
  if (authorError !== null && authorError.status !== 404) {
    throw error
  }

  return {
    props: {
      id,
      data: {
        incident,
        author,
      },
    },
  }
}
