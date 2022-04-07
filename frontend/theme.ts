import { Keyframes, keyframes } from 'styled-components'

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
  transitions: {
    slideIn: string;
    slideOut: string;
  }
  animations: {
    [K in AnimationName]: Animation
  }
}

export type Breakpoint =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'

export type AnimationName =
  | 'shake'

export interface Animation {
  name: Keyframes
  duration: number
  timing: string
}

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
  transitions: {
    slideIn: 'cubic-bezier(0.23, 1, 0.32, 1) 300ms',
    slideOut: 'cubic-bezier(calc(1 - 0.32), 0, calc(1 - 0.23), 0) 300ms',
  },
  animations: {
    shake: {
      duration: 600,
      timing: 'ease',
      name: keyframes`
        10%, 90% {
          transform: translateX(-1px);
        }
        20%, 80% {
          transform: translateX(2px);
        }
        30%, 50%, 70% {
          transform: translateX(-4px);
        }
        40%, 60% {
          transform: translateX(4px);
        }
      `,
    },
  },
}

interface ThemedProps {
  theme: Theme
}

class ThemedType {
  readonly media: ThemedMedia = Object.keys(defaultTheme.breakpoints).reduce((themed, breakpoint) => {
    themed[breakpoint] = {
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
    return themed
  }, {} as ThemedMedia)

  readonly animations: ThemedAnimations = Object.keys(defaultTheme.animations).reduce((themed, animationName) => {
    themed[animationName] = ({ theme }) => {
      const animation = theme.animations[animationName]
      return `${animation.duration}ms ${animation.timing} ${animation.name}`
    }
    return themed
  }, {} as ThemedAnimations)
}
export const Themed = new ThemedType()

type ThemedFn = (props: ThemedProps) => string

type ThemedMedia = Record<Breakpoint, {
  only: ThemedFn
  min: ThemedFn
  max: ThemedFn
}>

type ThemedAnimations = Record<AnimationName, ThemedFn>
