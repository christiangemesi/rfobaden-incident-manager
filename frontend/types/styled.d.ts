import 'styled-components'
import { Breakpoint } from '@/theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: {
      [K in Breakpoint]: {
        min: number
        max: number
      }
    }
  }
}