import { useMemo } from 'react'

const useWhere = <T, V>(records: readonly T[], get: (record: T) => V, value: V): T[] => {
  return useMemo(() => (
    records.filter((it) => get(it) === value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [records, value])
}
export default useWhere
