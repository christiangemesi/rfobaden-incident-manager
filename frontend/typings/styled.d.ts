import 'styled-components'
import { Theme } from '@/theme'

declare module 'styled-components' {
  export function useTheme(): Theme;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
