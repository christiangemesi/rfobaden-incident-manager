import 'styled-components'
import { Theme } from '@/theme'

declare module 'styled-components' {
  export function useTheme(): Theme;

  export type DefaultTheme = Theme
}
