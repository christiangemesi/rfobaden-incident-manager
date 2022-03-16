
export const run = <T>(action: () => T): T => action()

export const noop = (..._args: unknown[]): void => {
  return
}

export const sleep = (millis: number): Promise<void> => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
)