type Id<_T> = number
export default Id

export const isId = (value: unknown): value is Id<unknown> => (
  typeof value === 'number'
)
