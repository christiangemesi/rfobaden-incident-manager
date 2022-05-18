import { ColorName } from '@/theme'

/**
 * `Alert` represents an event, which will be displayed to a user
 */
export default interface Alert {
  /**
   * An unique identifier for each alert.
   */
  id: number

  /**
   * The text which will be displayed on the alert.
   */
  text: string

  /**
   * The type of alert defined by a {@link ColorName}
   */
  type: ColorName

  /**
   * Enables automatic fading out of the alert.
   */
  isFading: boolean
}