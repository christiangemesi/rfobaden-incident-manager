import { useMemo } from 'react'
import { useWindowSize } from 'react-use'
import { useTheme } from 'styled-components'
import { Breakpoint, Theme } from '@/theme'

type Options<T> = {
  [K in Breakpoint]?: T
} & {
  xs: T
}

const useBreakpoint = <T>(options: Options<T>, deps: unknown[] = []): T => {
  const { breakpoints } = useTheme()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mappedOptions = useMemo(() => fillAllOptions(options, breakpoints), [breakpoints, ...deps])
  const breakpointName = useBreakpointName()
  return mappedOptions[breakpointName]
}
export default useBreakpoint

export const useBreakpointName = (): Breakpoint => {
  const { width } = useWindowSize()
  const { breakpoints } = useTheme()
  return useMemo(() => {
    if (width === Infinity) {
      return 'xs'
    }

    for (const breakpointName of Object.keys(breakpoints)) {
      const breakpoint = breakpoints[breakpointName]
      if (breakpoint.max === null || breakpoint.max >= width) {
        return breakpointName
      }
    }
    throw new Error(`no matching breakpoint found for window width ${width}`)
  }, [width, breakpoints])
}

const fillAllOptions = <T>(options: Options<T>, breakpoints: Theme['breakpoints']): Required<Options<T>> => {
  const allOptions = { ...options } as Required<Options<T>>
  const breakpointNames = Object.keys(breakpoints)
  let prev = options.xs
  for (let i = 1; i < breakpointNames.length; i++) {
    const breakpointName = breakpointNames[i]
    const breakpoint = options[breakpointName]
    if (breakpoint === undefined) {
      allOptions[breakpointName] = prev
    } else {
      prev = breakpoint
    }
  }
  return allOptions
}
