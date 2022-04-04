import React from 'react'
import styled, { css } from 'styled-components'

const UiTabs = styled.ul`
  display: flex;
`

const Tab = styled.li<{ isActive: boolean }>`
  flex: 0 1 100%;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  
  border: 1px solid ${({ theme }) => theme.colors.grey.value};
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  transition: 150ms ease-out;
  transition-property: border-color;
  ${({ isActive }) => isActive ? css`
    border-bottom-color: transparent;
  ` : css`
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  `}
`

export default Object.assign(UiTabs, {
  Tab,
})