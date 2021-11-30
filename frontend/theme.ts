export type Theme = {
  colors: {
    primary: Color
    secondary: Color
    success: Color
    error: Color
    warning: Color
    info: Color
  }
  breakpoints: {
    [K in Breakpoint]: {
      min: number
      max: number
    }
  }
}

export type Breakpoint =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export type ColorName = keyof Theme['colors']

export interface Color {
  value: string
  contrast: string
}

export const contrastDark = '#1D3557'
export const contrastWhite = '#F1FAEE'

export const defaultTheme: Theme = {
  colors: {
    primary: {
      value: '#457B9D',
      contrast: contrastWhite,
    },
    secondary: {
      value: '#A8DADC',
      contrast: contrastDark,
    },
    success: {
      value: '#74BD6E',
      contrast: contrastDark,
    },
    error: {
      value: '#E63946',
      contrast: contrastWhite,
    },
    warning: {
      value: '#F5D35A',
      contrast: contrastDark,
    },
    info: {
      value: '#6F54A9',
      contrast: contrastWhite,
    },
  },
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
