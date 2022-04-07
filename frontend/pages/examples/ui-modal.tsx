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

        <p>
          <UiModal>
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Simple Modal
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>
              I am a modal!
            </UiModal.Body>
          </UiModal>
          A modal opens a window on top of the current page.
          <br />
          It can be closed by either clicking outside of it, or using the built-in close button.
        </p>

        <p>
          <UiModal size="full">
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Full Size Modal
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>
              I am a full-size modal!
            </UiModal.Body>
          </UiModal>
          <p>
            The width of the modal can be set with the <Code>size</Code> property.
            <br />
            The default value for it is <Code>&quot;auto&quot;</Code>, which makes the modal size to the minimal
            width with which its content can be displayed.
            <br />
            Using <Code>size=&quot;full&quot;</Code> will force the modal to take up the full width
            available to the current breakpoint.
          </p>
        </p>

        <p>
          <UiModal noCloseButton>
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Custom Close Button
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>{({ close }) => (
              <UiButton onClick={close}>Close Me!</UiButton>
            )}</UiModal.Body>
          </UiModal>
          <p>
            The modal body can control the modal by passing a function instead of simple HTML to the <Code>children</Code> property.
            <br />
            This function will - amongst other parameters - receive a <Code>close</Code> callback which closes the modal when called.
            <br /> <br />
            The default close button can be hidden using the <Code>noCloseButton</Code> property.
          </p>
        </p>

        <p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <UiModal isPersistent>
              <UiModal.Trigger>{({ open }) => (
                <UiButton onClick={open}>
                  Fixed Persistence
                </UiButton>
              )}</UiModal.Trigger>
              <UiModal.Body>{({ isPersistent, persist }) => (
                <UiButton isDisabled={isPersistent} onClick={persist}>
                  {isPersistent ? 'I am always persistent!' : 'This will never appear.'}
                </UiButton>
              )}</UiModal.Body>
            </UiModal>

            <UiModal isPersistent={false}>
              <UiModal.Trigger>{({ open }) => (
                <UiButton onClick={open}>
                  Fixed Non-Persistence
                </UiButton>
              )}</UiModal.Trigger>
              <UiModal.Body>{({ isPersistent, persist }) => (
                <UiButton isDisabled={isPersistent} onClick={persist}>
                  {isPersistent ? 'This will never appear.' : 'I can\'t be persisted!'}
                </UiButton>
              )}</UiModal.Body>
            </UiModal>

            <UiModal>
              <UiModal.Trigger>{({ open }) => (
                <UiButton onClick={open}>
                  Auto Persistence
                </UiButton>
              )}</UiModal.Trigger>
              <UiModal.Body>{({ isPersistent, persist }) => (
                <UiButton isDisabled={isPersistent} onClick={persist}>
                  {isPersistent ? 'I am persistent!' : 'Persist me!'}
                </UiButton>
              )}</UiModal.Body>
            </UiModal>
          </div>
          <p>
            A modals <em>persistence</em> determines if the modal can be closed by just clicking outside it.
            <br />
            The persistence is set via the <Code>isPersistent</Code> property.
          </p>
          <ul>
            <li>
              <Code>isPersistent</Code> or <Code>isPersistent={'{true}'}</Code> means that the modal is always persistent.
            </li>
            <li>
              <Code>isPersistent={'{false}'}</Code> means that the modal can never be persistent.
            </li>
            <li>
              By default, the modal will not be persistent.
              <br />
              Some components, such as <Code>UiForm</Code>, may however cause the modal to become persistent automatically whenever a field is filled in.
              <br />
              This behaviour is disabled when the persistence is set explicitly.
            </li>
          </ul>
        </p>

        <p>
          <UiModal>
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Nested Modals
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>{({ close }) => (
              <UiModal>
                <UiModal.Trigger>{({ open }) => (
                  <UiButton onClick={open}>
                    Open Me!
                  </UiButton>
                )}</UiModal.Trigger>
                <UiModal.Body>
                  Here I am!
                </UiModal.Body>
              </UiModal>
            )}</UiModal.Body>
          </UiModal>
          <p>
            The modal body can control the modal by passing a function instead of simple HTML to the <Code>children</Code> property.
            <br />
            This function will - amongst other parameters - receive a <Code>close</Code> callback which closes the modal when called.
            <br /> <br />
            The default close button can be hidden using the <Code>noCloseButton</Code> property.
          </p>
        </p>

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
  display: inline-flex;
  flex-direction: column;
  gap: 2rem;
  
  & > p {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    em {
      font-style: italic;
    }
  }
  
  & > ul {
    list-style: disc;
    margin-left: 1rem;
    margin-top: 0.5rem;
  }
`

const Code = styled.code`
  font-family: Consolas, monospace;
`