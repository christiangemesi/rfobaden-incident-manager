import React from 'react'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiButton from '@/components/Ui/Button/UiButton'

const UiModalExample: React.VFC = () => {

  return (
    <UiContainer>
      <Heading>
        <Code>UiModal</Code> Examples
      </Heading>

      <SpacedSection>

        <UiModal>
          <UiModal.Activator>{({ open }) => (
            <UiButton onClick={open}>
              Empty Modal
            </UiButton>
          )}</UiModal.Activator>
          <UiModal.Body>
            Hello!
          </UiModal.Body>
        </UiModal>

        <UiModal isFull>
          <UiModal.Activator>{({ open }) => (
            <UiButton onClick={open}>
              Full Size Modal
            </UiButton>
          )}</UiModal.Activator>
          <UiModal.Body>
            Hello!
          </UiModal.Body>
        </UiModal>

        <UiModal>
          <UiModal.Activator>{({ open }) => (
            <UiButton onClick={open}>
              With Close Button
            </UiButton>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close }) => (
            <UiButton onClick={close}>
              Close Me!
            </UiButton>
          )}</UiModal.Body>
        </UiModal>

        <UiModal isPersistent>
          <UiModal.Activator>{({ open }) => (
            <UiButton onClick={open}>
              Persistent Modal
            </UiButton>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close }) => (
            <UiButton onClick={close}>
              Close Me!
            </UiButton>
          )}</UiModal.Body>
        </UiModal>

        <UiModal>
          <UiModal.Activator>{({ open }) => (
            <UiButton onClick={open}>
              Dynamic Persistance
            </UiButton>
          )}</UiModal.Activator>
          <UiModal.Body>{({ close, persist, isPersistent }) => (
            <div>
              <UiButton onClick={close}>
                Close Me!
              </UiButton>
              <UiButton onClick={persist} isDisabled={isPersistent}>
                persist
              </UiButton>
            </div>
          )}</UiModal.Body>
        </UiModal>

      </SpacedSection>
    </UiContainer>
  )
}
export default UiModalExample


const Heading = styled.h1`
  font-size: 2rem;
  margin-top: 3rem;
`

const SpacedSection = styled.section`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`

const Code = styled.code`
  font-family: monospace;
`