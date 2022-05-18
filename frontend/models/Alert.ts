import { ColorName } from '@/theme'

/**
 * `Alert` represents an event, which will be displayed to a user.
 */
export default interface Alert {
  /**
   * An unique identifier for each `Alert`.
   */
  id: number

  /**
   * The text which will be displayed on the `Alert`.
   */
  text: string

  /**
   * The type of `Alert` defined by a {@link ColorName}.
   */
  type: ColorName

  /**
   * Enables automatic fading out of the `Alert`.
   */
  isFading: boolean
}