import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

/**
 * `Vehicle` represents a vehicle usable in a {@link Transport}.
 */
export default interface Vehicle extends Model {
  /**
   * Name of the vehicle.
   */
  name: string

  /**
   * Whether the vehicle is visible to users.
   */
  isVisible: boolean
}

/**
 * Parses a vehicle's JSON structure.
 *
 * @param data The vehicle to parse.
 * @return The parsed vehicle.
 */
export const parseVehicle = (data: Vehicle): Vehicle => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

/**
 * Loads the name of a vehicle.
 *
 * @param vehicleId The id of the vehicle.
 * @return The name of vehicle.
 */
export const getVehicleName = async (vehicleId: Id<Vehicle> | null): Promise<string> => {
  if (vehicleId === null) {
    return ''
  }

  // load the vehicle with the id from the backend
  const [vehicle, vehicleError]: BackendResponse<Vehicle> = await BackendService.find(
    `vehicles/${vehicleId}`,
  )
  if (vehicleError !== null) {
    throw vehicleError
  }

  return vehicle.name
}