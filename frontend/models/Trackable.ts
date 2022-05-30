import Model, { parseModel } from '@/models/base/Model'
import Priority from '@/models/Priority'
import Id from '@/models/base/Id'
import User from '@/models/User'
import { parseDateOrNull } from '@/models/base/Date'
import Incident from '@/models/Incident'

/**
 * `Trackable` defines an entity whose progress can be documented and monitored.
 */
export default interface Trackable extends Model {
  /**
   * The title of the trackable entity.
   */
  title: string

  /**
   * A textual description of what the trackable entity is about.
   */
  description: string | null

  /**
   * The priority of the trackable entity.
   */
  priority: Priority

  /**
   * Whether the trackable entity is closed.
   * A closed trackable entity counts as completed.
   */
  isClosed: boolean

  /**
   * The moment in time at which the trackable entity will start.
   * This represents the actual time at which the real-life event
   * managed in this entity will start.
   * <p>
   *     This is used to plan a trackable entity in advance.
   * </p>
   */
  startsAt: Date | null

  /**
   * The moment in time at which the trackable entity will end.
   * This represents the actual time at which the real-life event
   * managed in this entity will end.
   */
  endsAt: Date | null

  /**
   * The {@link User assignee} responsible for the completion of the trackable entity.
   */
  assigneeId: Id<User> | null

  /**
   * The {@link Incident} id the entity belongs to.
   */
  incidentId: Id<Incident>
}

/**
 * Parses a report's JSON structure.
 *
 * @param data The report to parse.
 * @return The parsed report.
 */
export const parseTrackable = (data: Trackable): Trackable => {
  return {
    ...data,
    ...parseModel(data),
    startsAt: parseDateOrNull(data.startsAt),
    endsAt: parseDateOrNull(data.endsAt),
  }
}
