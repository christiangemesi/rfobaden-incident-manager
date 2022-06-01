import { css, FlattenSimpleInterpolation, Keyframes, keyframes } from 'styled-components'

/**
 * `Theme` updates the colors, fonts and fontsizes of the application
 */
export type Theme = {
  colors: {

    /**
     * primary color used by the application.
     */
    primary: Color

    /**
     * secondary color used by the application.
     */
    secondary: Color

    /**
     * tertiary color used by the application.
     */
    tertiary: Color

    /**
     * light color used by the application.
     */
    light: Color

    /**
     * success color used by the application.
     */
    success: Color

    /**
     * error color used by the application.
     */
    error: Color

    /**
     * warning color used by the application.
     */
    warning: Color

    /**
     * info color used by the application.
     */
    info: Color

    /**
     * grey color used by the application.
     */
    grey: Color

    /**
     * active color used by the application.
     */
    active: Color

    /**
     * activeClosed color used by the application.
     */
    activeClosed: Color
  }
  fonts: {

    /**
     * heading font used by the application.
     */
    heading: string

    /**
     * body font used by the application.
     */
    body: string
    sizes: {

      /**
       * root size used by the application.
       */
      root: string,

      /**
       * small size used by the application.
       */
      small: string,
    }
  }
  breakpoints: {
    [K in Breakpoint]: {

      /**
       * minimum breakpoint size.
       */
      min: number

      /**
       * maximum breakpoint size.
       */
      max: number
    }
  }
  transitions: {

    /**
     * SlideIn type and time used for the slide.
     */
    slideIn: string;

    /**
     * SlideOut type and time used for the slide.
     */
    slideOut: string;
  }
  animations: {

    /**
     * with this i need help
     */
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
  hover: string
}

export const contrastDark = '#051A27'
export const contrastLight = '#F3F8FC'

export const defaultTheme: Theme = {
  colors: {
    primary: {
      value: '#1980C3',
      contrast: contrastLight,
      hover: '#0B72B5',
    },
    secondary: {
      value: '#DBEBF7',
      contrast: contrastDark,
      hover: '#D1E0EB',
    },
    tertiary: {
      value: '#BDD7EA',
      contrast: contrastDark,
      hover: '#B4CFE3',
    },
    light: {
      value: contrastLight,
      contrast: contrastDark,
      hover: '#EDF1F4',
    },
    success: {
      value: '#05A74E',
      contrast: contrastLight,
      hover: '#0B9F4E',
    },
    error: {
      value: '#FF4D4F',
      contrast: contrastLight,
      hover: '#EE4F51',
    },
    warning: {
      value: '#FAAD14',
      contrast: contrastDark,
      hover: '#ECA519',
    },
    info: {
      value: '#7465C6',
      contrast: contrastLight,
      hover: '#6857C8',
    },
    grey: {
      value: '#E2E9ED',
      contrast: contrastDark,
      hover: '#DDE5EB',
    },
    active: {
      value: '#EFF6FB',
      contrast: contrastDark,
      hover: '#B4CFE3',
    },
    activeClosed: {
      value: '#EFF4F8',
      contrast: '#BFBFBF',
      hover: '#e2e8ec',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    sizes: {
      root: '16px',
      small: '0.9em',
    },
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
      return css`${animation.duration}ms ${animation.timing} ${animation.name}`
    }
    return themed
  }, {} as ThemedAnimations)
}
export const Themed = new ThemedType()

type ThemedFn = (props: ThemedProps) => string | FlattenSimpleInterpolation

type ThemedMedia = Record<Breakpoint, {
  only: ThemedFn
  min: ThemedFn
  max: ThemedFn
}>

type ThemedAnimations = Record<AnimationName, ThemedFn>
