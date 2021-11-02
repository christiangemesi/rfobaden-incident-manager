import Model from '@/models/base/Model'

export default interface User extends Model {
  name: string
}

export const parseUser = (data: unknown) => data as User
