import React, { useState } from 'react'
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
        <div>
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
        </div>

        <div>
          <UiModal title="I have a title!">
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Titled Modal
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>
              I am a modal!
            </UiModal.Body>
          </UiModal>
          Modals can have a built-in title, which will appear right before the close button.
        </div>

        <div>
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
          <UiModal size="fixed">
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Fixed Size Modal
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>
              I am a fixed-size modal!
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
            <br />
            Using <Code>size=&quot;fixed&quot;</Code> will force the modal to take up a pre-defined width.
          </p>
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
          <UiModal>
            <UiModal.Trigger>{({ open }) => (
              <UiButton onClick={open}>
                Nested Modals
              </UiButton>
            )}</UiModal.Trigger>
            <UiModal.Body>
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
            </UiModal.Body>
          </UiModal>
          <p>
            The modal body can control the modal by passing a function instead of simple HTML to the <Code>children</Code> property.
            <br />
            This function will - amongst other parameters - receive a <Code>close</Code> callback which closes the modal when called.
            <br /> <br />
            The default close button can be hidden using the <Code>noCloseButton</Code> property.
          </p>
        </div>

        <ControlledModal />
      </SpacedSection>
    </UiContainer>
  )
}
export default UiModalExample

const ControlledModal: React.VFC = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div>
      <UiButton onClick={() => setOpen(true)}>
        Controlled Modal
      </UiButton>
      <UiModal isOpen={isOpen} onToggle={setOpen}>{({ close }) => (
        <div>
          I am a controlled modal!
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <UiButton onClick={close}>
              Close me normally!
            </UiButton>
            <UiButton onClick={() => setOpen(false)}>
              Close me directly!
            </UiButton>
          </div>
        </div>
      )}</UiModal>
      <p>
        A controlled modal is a modal whose open/close state is not stored and controlled by the modal component itself.
        <br />
        This is useful if you need to know if a modal is opened outside of it, or if the modals trigger can&apos;t
        be written inside a <Code>Modal.Trigger</Code> component for some reason.
      </p>
      <p>
        Controlled modals also allow multiple triggers to exist at completely different places,
        for example <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setOpen(true)}>here!</span>
      </p>
    </div>
  )
}

const Heading = styled.h1`
  font-size: 2rem;
  margin-top: 3rem;
`

const SpacedSection = styled.section`
  margin-top: 1rem;
  display: inline-flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 60rem;
  
  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    em {
      font-style: italic;
    }
    
    ul {
      list-style: disc;
      margin-left: 1rem;
      margin-top: 0.5rem;
    }
  }
`

const Code = styled.code`
  font-family: Consolas, monospace;
`
