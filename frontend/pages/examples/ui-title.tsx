import React from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'

/**
 * `UiTitleExample` is an example page for the {@link UiTitle} component.
 */
const UiTitleExample: React.VFC = () => {
  return (
    <div>
      {/* Default level titles */}
      <UiTitle level={1}>
        H1
      </UiTitle>
      <UiTitle level={2}>
        H2
      </UiTitle>
      <UiTitle level={3}>
        H3
      </UiTitle>
      <UiTitle level={4}>
        H4
      </UiTitle>
      <UiTitle level={5}>
        H5
      </UiTitle>
      <UiTitle level={6}>
        H6
      </UiTitle>

      {/* Centered title levels */}
      <UiTitle level={1} isCentered>
        Centered H1
      </UiTitle>
      <UiTitle level={2} isCentered>
        Centered H2
      </UiTitle>
      <UiTitle level={3} isCentered>
        Centered H3
      </UiTitle>
      <UiTitle level={4} isCentered>
        Centered H4
      </UiTitle>
      <UiTitle level={5} isCentered>
        Centered H5
      </UiTitle>
      <UiTitle level={6} isCentered>
        Centered H6
      </UiTitle>
    </div>
  )
}
export default UiTitleExample
