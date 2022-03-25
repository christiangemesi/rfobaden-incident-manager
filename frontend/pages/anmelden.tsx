import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React from 'react'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'

const AnmeldenPage: React.VFC = () => {
  return (
    <UiContainer>
      <SessionForm />
    </UiContainer>
  )
}
export default AnmeldenPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = getSessionFromRequest(req)
  if (user !== null) {
    return { redirect: { statusCode: 302, destination: '/' }}
  }
  return {
    props: {},
  }
}