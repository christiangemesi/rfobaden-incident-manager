export type Theme = {
  colors: {
    primary: Color
    secondary: Color
    tertiary: Color
    success: Color
    error: Color
    warning: Color
    info: Color
  }
  fonts: {
    heading: string
    body: string
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

export const contrastDark = '#051A27'
export const contrastLight = '#F3F8FC'

export const defaultTheme: Theme = {
  colors: {
    primary: {
      value: '#1980C3',
      contrast: contrastLight,
    },
    secondary: {
      value: '#A3CCE7',
      contrast: contrastDark,
    },
    tertiary: {
      value: contrastLight,
      contrast: contrastDark,
    },
    success: {
      value: '#4fac54',
      contrast: contrastLight,
    },
    error: {
      value: '#FF4D4F',
      contrast: contrastLight,
    },
    warning: {
      value: '#FAAD14',
      contrast: contrastDark,
    },
    info: {
      value: '#7465C6',
      contrast: contrastLight,
    },
  },
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Montserrat, sans-serif',
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
