import Model, { parseModel } from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import CloseReason, { parseCloseReason } from '@/models/CloseReason'
import Report from '@/models/Report'
import Transport from '@/models/Transport'
import Id from '@/models/base/Id'
import Document from '@/models/Document'
import Organization from '@/models/Organization'

/**
 * `Incident` represents any major event handled via the IncidentManager.
 * It is further divided into {@link Transport} and {@link Report} entities.
 */
export default interface Incident extends Model {
  /**
   * The title of the incident.
   */
  title: string

  /**
   * A textual description of what the incident is about.
   */
  description: string | null

  /**
   * The moment in time at which the incident will start.
   * This represents the actual time at which the real-life event
   * managed in this entity will start.
   * <p>
   *     This is used to plan an incident in advance.
   * </p>
   */
  startsAt: Date | null

  /**
   * The moment in time at which the incident will end.
   * This represents the actual time at which the real-life event
   * managed in this entity will end.
   */
  endsAt: Date | null

  /**
   * The reason for closing the incident.
   * It is {@code null} if the incident has never been {@link #isClosed closed}.
   */
  closeReason: CloseReason | null

  /**
   * Whether the incident is closed.
   * A closed incident counts as completed.
   */
  isClosed: boolean

  /**
   * Whether the incident is done.
   * An incident is done when all its {@link Transport transports}
   * and {@link Report reports} are all closed or done.
   */
  isDone: boolean

  /**
   * Lists the ids of all closed {@link Report reports}.
   */
  closedReportIds: Id<Report>[]

  /**
   * Lists the ids of all {@link Report reports}.
   */
  reportIds: Id<Report>[]

  /**
   * Lists the ids of all closed {@link Transport transports}.
   */
  closedTransportIds: Id<Transport>[]

  /**
   * Lists the ids of all {@link Transport transports}.
   */
  transportIds: Id<Transport>[]

  /**
   * Set of ids of all {@link Organization organizations}
   * that are connected to this incident.
   */
  organizationIds: Id<Organization>[]

  /**
   * The images attached to the incident, stored as {@link Document} instances.
   */
  images: Document[]

  /**
   * The {@link Document documents} attached to the incident.
   * Does not include the incident's {@link #images image documents}.
   */
  documents: Document[]
}

/**
 * Parses an incident's JSON structure.
 *
 * @param data The incident to parse.
 * @return The parsed incident.
 */
export const parseIncident = (data: Incident): Incident => {
  return {
    ...data,
    ...parseModel(data),
    startsAt: parseDateOrNull(data.startsAt),
    endsAt: parseDateOrNull(data.endsAt),
    closeReason: data.closeReason && parseCloseReason(data.closeReason),
  }
}

/**
 * Parses a date's JSON structure.
 *
 * @param date The date to parse.
 * @return The parsed date.
 */
const parseDateOrNull = (date: Date | null): Date | null => {
  return date === null ? null : parseDate(date)
}

/**
 * `ClosedIncident` represents an incident that is {@link Incident.isClosed closed}.
 */
export interface ClosedIncident extends Incident {
  closeReason: CloseReason
  isClosed: true
}

/**
 * Checks if an incident is an instance of {@link ClosedIncident}.
 *
 * @param incident The incident.
 * @return Whether the incident is a {@link ClosedIncident}.
 */
export const isClosedIncident = (incident: Incident): incident is ClosedIncident =>
  incident.isClosed && incident.closeReason !== null
