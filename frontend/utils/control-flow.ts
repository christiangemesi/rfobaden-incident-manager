/**
 * Runs a function and returns the result.
 *
 * @param action The function to execute.
 */
export const run = <T>(action: () => T): T => action()

/**
 * A function that takes any number of arguments, does nothing, and returns `undefined`.
 *
 * @param _args The arguments, all of which are ignored.
 */
export const noop = (..._args: unknown[]): void => {
  return
}

/**
 * Creates a promise that resolves after a specific amount of milliseconds.
 *
 * @param millis The milliseconds to sleep for.
 */
export const sleep = (millis: number): Promise<void> => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
)