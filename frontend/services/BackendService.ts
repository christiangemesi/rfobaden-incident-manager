import Model, { ModelData } from '@/models/base/Model'
import { run } from '@/utils/control-flow'

const apiEndpoint = run(() => {
  const value = process.env['NEXT_PUBLIC_BACKEND_ENDPOINT']
  if (value.endsWith('/')) {
    return value.substr(0, value.length - 1)
  }
  return value
})

class BackendService {
  create<T extends Model>(data: ModelData<T>): Promise<T>
  create<D, T>(data: D): Promise<T>
  async create<D, T>(data: D): Promise<T> {
    const res = await fetch(`${apiEndpoint}/api/v1/users`, {
      method: 'post',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status < 200 || 299 < res.status) {
      // TODO error handling
      throw new Error(`backend request failed: ${await res.text()}`)
    }
    return await res.json()
  }
}
export default new BackendService()
