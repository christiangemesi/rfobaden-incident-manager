import React, { ReactNode } from 'react'
import UiList from '@/components/Ui/List/UiList'
import styled, { css } from 'styled-components'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { asStyled, StyledProps } from '@/utils/helpers/StyleHelper'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import { Themed } from '@/theme'
import Trackable from '@/models/Trackable'
import { noop } from '@/utils/control-flow'
import { Props as TrackableListItemProps } from '@/components/Trackable/List/Item/TrackableListItem'

interface Props<T> extends StyledProps {
  records: Array<readonly T[]>
  selected?: T | null,
  onSelect?: (record: T) => void

  renderForm: (props: { save(record: T): void, close(): void }) => ReactNode
  renderItem: (props: Omit<TrackableListItemProps<T>, 'isClosed' | 'children'>) => ReactNode
}

const ReportList = <T extends Trackable>({
  records,
  selected = null,
  onSelect: handleSelect,
  style,
  className,
  renderForm,
  renderItem,
}: Props<T>): JSX.Element => {
  const canListBeSmall = useBreakpoint(() => ({
    xs: false,
    xl: true,
  }))
  return (
    <ListContainer hasSelected={selected !== null} style={style} className={className}>
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreateButton onClick={open} title="Meldung erfassen">
            <UiIcon.CreateAction size={1.5} />
          </UiCreateButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          renderForm({ save: handleSelect ?? noop, close })
        )}</UiModal.Body>
      </UiModal>

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
