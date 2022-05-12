import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

export default interface Vehicle extends Model {
  name: string
  isVisible: boolean
}

export const parseVehicle = (data: Vehicle): Vehicle => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

export const getVehicleName = async (vehicleId: Id<Vehicle> | null): Promise<string> => {
  if (vehicleId === null) {
    return ''
  }

  const [vehicle, vehicleError]: BackendResponse<Vehicle> = await BackendService.find(
    `vehicles/${vehicleId}`,
  )
  if (vehicleError !== null) {
    throw vehicleError
  }
  return vehicle.name
}