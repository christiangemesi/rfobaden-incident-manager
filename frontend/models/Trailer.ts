import Model from '@/models/base/Model'
import { parseDate } from '@/models/base/Date'
import Id from '@/models/base/Id'
import BackendService, { BackendResponse } from '@/services/BackendService'

export default interface Trailer extends Model {
  name: string
  isVisible: boolean
}

export const parseTrailer = (data: Trailer): Trailer => ({
  ...data,
  createdAt: parseDate(data.createdAt),
  updatedAt: parseDate(data.updatedAt),
})

export const getVehicleName = async (trailerId: Id<Trailer> | null): Promise<string> => {
  if (trailerId === null) {
    return ''
  }

  const [trailer, trailerError]: BackendResponse<Trailer> = await BackendService.find(
    `trailer/${trailerId}`,
  )
  if (trailerError !== null) {
    throw trailerError
  }
  return trailer.name
}