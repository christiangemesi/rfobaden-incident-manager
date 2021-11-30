import React from 'react'
import UiTitle from '@/components/Ui/Title/UiTitle'


const uiTitle: React.VFC = () => {
  return (
    <div>
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

    </div>
  )
}

export default uiTitle
