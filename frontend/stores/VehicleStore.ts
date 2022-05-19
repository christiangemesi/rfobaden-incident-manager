import { createModelStore } from '@/stores/base/Store'
import { parseVehicle } from '@/models/Vehicle'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

/**
 * Store that manages name-sorted vehicles
 */
const VehicleStore = createModelStore(parseVehicle, {
  sortBy: (vehicle) => [
    vehicle.name.toLowerCase(),
  ],
})

export default VehicleStore

/**
 * Gets a specific vehicle from the vehicle store by its id
 */
export const useVehicle = createUseRecord(VehicleStore)

/**
 * Gets all vehicles from the vehicle store with an optional transformation
 */
export const useVehicles = createUseRecords(VehicleStore)

