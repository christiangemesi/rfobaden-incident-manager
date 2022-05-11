import { ColorName } from '@/theme'

export default interface Alert {
  id: number
  text: string
  type: ColorName
  isFading: boolean
}