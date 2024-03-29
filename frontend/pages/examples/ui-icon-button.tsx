import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'


/**
 * `UiIconButtonGroupExample` is an example page for the {@link UiIconButtonGroup} component.
 */
const UiIconButtonGroupExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={3}>Icon-Button</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIconButton color="primary" onClick={() => alert('Test')}>
            <UiIcon.Organization />
          </UiIconButton>
        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>Icon-Button-Group</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIconButtonGroup>
            <UiIconButton>
              <UiIcon.PrintAction />
            </UiIconButton>
            <UiIconButton>
              <UiIcon.EditAction />
            </UiIconButton>
            <UiIconButton color="error">
              <UiIcon.DeleteAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiIconButtonGroupExample
