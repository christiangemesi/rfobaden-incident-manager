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
   * Defines the visibility of the vehicle in the {@link UiSelectInput}.
   */
  isVisible: boolean
}

/**
 * Parses the vehicle data to a unique format.
 *
 * @param data Vehicle to parse.
 * @return Parsed vehicle.
 */
export const parseVehicle = (data: Vehicle): Vehicle => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

/**
 * Gets the name of a vehicle by its id from the backend.
 *
 * @param vehicleId Id of the vehicle.
 * @return Name of vehicle.
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