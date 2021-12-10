import Model, { parseModel } from '@/models/base/Model'

export default interface User extends Model {
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export enum UserRole {
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

export const parseUser = (data: unknown): User => {
  const user = data as User
  return {
    ...user,
    ...parseModel(data),
  }
}

export const useUsername = (user: User | null): string | null => {
  if(user === null){
    return null
  }
  return `${user.firstName} ${user.lastName}`
}
