import { createModelStore } from '@/stores/base/Store'
import { parseVehicle } from '@/models/Vehicle'
import { createUseRecord, createUseRecords } from '@/stores/base/hooks'

/**
 * Store that manages name-sorted vehicles.
 */
const VehicleStore = createModelStore(parseVehicle, {
  sortBy: (vehicle) => [
    vehicle.name.toLowerCase(),
  ],
})

export default VehicleStore

/**
 * {@code useVehicle} is a react hook which loads a specific vehicle from {@link VehicleStore}.
 * It re-renders whenever the vehicle is changed.
 *
 * @param id The id of the vehicle.
 * @return The vehicle.
 */
export const useVehicle = createUseRecord(VehicleStore)

/**
 * {@code useVehicles} is a react hook that loads all vehicles from {@link VehicleStore}.
 * It re-renders whenever the store is modified.
 *
 * @param idsOrTransform? An list of ids to load, or a function that modifies the returned list.
 * @return The list of vehicles.
 */
export const useVehicles = createUseRecords(VehicleStore)

