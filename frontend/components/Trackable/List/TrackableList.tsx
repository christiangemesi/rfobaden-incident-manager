import React, { ReactNode } from 'react'
import UiList from '@/components/Ui/List/UiList'
import styled, { css } from 'styled-components'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { asStyled, StyledProps } from '@/utils/helpers/StyleHelper'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import { Themed } from '@/theme'
import Trackable from '@/models/Trackable'
import { noop } from '@/utils/control-flow'
import { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'
import Incident from '@/models/Incident'

interface Props<T> extends StyledProps {
  incident: Incident

  records: Array<readonly T[]>
  selected?: T | null,
  onSelect?: (record: T) => void

  formTitle: string
  renderForm: (props: { save(record: T): void, close(): void }) => ReactNode
  renderItem: (props: Omit<TrackableListItemProps<T>, 'isClosed' | 'children'>) => ReactNode
}

const ReportList = <T extends Trackable>({
  incident,
  records,
  selected = null,
  onSelect: handleSelect,
  style,
  className,
  formTitle,
  renderForm,
  renderItem,
}: Props<T>): JSX.Element => {
  const canListBeSmall = useBreakpoint(() => ({
    xs: false,
    md: true,
  }))
  return (
    <ListContainer hasSelected={selected !== null} style={style} className={className}>
      {!incident.isClosed && (
        <UiDrawer title={formTitle} size="fixed">
          <UiDrawer.Trigger>{({ open }) => (
            <UiCreateButton onClick={open} title={formTitle}>
              <UiIcon.CreateAction size={1.5} />
            </UiCreateButton>
          )}</UiDrawer.Trigger>
          <UiDrawer.Body>{({ close }) => (
            renderForm({ save: handleSelect ?? noop, close })
          )}</UiDrawer.Body>
        </UiDrawer>)
      }

      {records.map((sectionRecords, i) => (
        <UiList key={i}>
          {sectionRecords.map((record) => (
            <React.Fragment key={record.id}>
              {renderItem({
                record,
                isActive: selected?.id === record.id,
                isSmall: canListBeSmall && selected !== null,
                onClick: handleSelect,
              })}
            </React.Fragment>
          ))}
        </UiList>
      ))}
    </ListContainer>
  )
}
export default asStyled(ReportList)

const ListContainer = styled.div<{ hasSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  will-change: padding-right;
  transition-property: padding-right;
  ${({ hasSelected }) => hasSelected && css`
    ${Themed.media.lg.min} {
      padding-right: 2rem;
    }
  `}
`
