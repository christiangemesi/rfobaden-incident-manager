import { css, DefaultTheme } from 'styled-components'

export type Theme = DefaultTheme

export type Breakpoint =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export const defaultTheme: Theme = {
  breakpoints: {
    xs: {
      min: 0,
      max: 640,
    },
    sm: {
      min: 640,
      max: 768,
    },
    md: {
      min: 768,
      max: 1024,
    },
    lg: {
      min: 1024,
      max: 1536,
    },
    xl: {
      min: 1536,
      max: Number.MAX_SAFE_INTEGER,
    },
  },
}

interface ThemedProps {
  theme: Theme
}

export const Themed = {
  mediaFrom: (breakpoint: Breakpoint) => ({ theme }: ThemedProps) => (
    `@media (min-width: ${theme.breakpoints[breakpoint].min}px)`
  ),
  mediaTo: (breakpoint: Breakpoint) => ({ theme }: ThemedProps) => (
    `@media (max-width: ${theme.breakpoints[breakpoint].max}px)`
  ),
  media: (breakpoint: Breakpoint) => ({ theme }: ThemedProps) => (
    `@media (min-width: ${theme.breakpoints[breakpoint].min}px) and (max-width: ${theme.breakpoints[breakpoint].max}px)`
  ),
}
