export type Theme = {
  colors: {
    primary: Color
    secondary: Color
    tertiary: Color
    success: Color
    error: Color
    warning: Color
    info: Color
    grey: Color
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
  | 'xxl'

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
      // value: '#E8F2F9',
      value: '#D1E0EB',
      contrast: contrastDark,
    },
    tertiary: {
      value: contrastLight,
      contrast: contrastDark,
    },
    success: {
      value: '#05A74E',
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
    grey: {
      value: '#b0b0b0',
      contrast: contrastDark,
    },
  },
  fonts: {
    heading: 'Raleway, sans-serif',
    body: 'Raleway, sans-serif',
  },
  breakpoints: {
    xs: {
      min: 0,
      max: 639.99,
    },
    sm: {
      min: 640,
      max: 767.99,
    },
    md: {
      min: 768,
      max: 1_023.99,
    },
    lg: {
      min: 1_024,
      max: 1_535.99,
    },
    xl: {
      min: 1_536,
      max: 2_047.99,
    },
    xxl: {
      min: 2_048,
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
