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

class ThemedType {
  readonly media: ThemedMedia = Object.keys(defaultTheme.breakpoints).reduce((record, breakpoint) => {
    record[breakpoint] = {
      min: ({ theme }) => (
        `@media (min-width: ${theme.breakpoints[breakpoint].min}px)`
      ),
      max: ({ theme }) => (
        `@media (max-width: ${theme.breakpoints[breakpoint].max}px)`
      ),
      only: ({ theme }) => (
        `@media (min-width: ${theme.breakpoints[breakpoint].min}px) and (max-width: ${theme.breakpoints[breakpoint].max}px)`
      ),
    }
    return record
  }, {} as ThemedMedia)
}
export const Themed = new ThemedType()

type ThemedMedia = Record<Breakpoint, {
  only: (props: ThemedProps) => string
  min: (props: ThemedProps) => string
  max: (props: ThemedProps) => string
}>
