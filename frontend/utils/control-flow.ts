
export const run = <T>(action: () => T): T => action()

export const noop = (..._args: unknown[]): void => {
  return
}