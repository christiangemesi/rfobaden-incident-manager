import Model, { ModelData } from '@/models/base/Model'
import { run } from '@/utils/control-flow'
import Id from '@/models/base/Id'

const apiEndpoint = run(() => {
  if (!process.browser) {
    return 'http://backend:8080'
  }
  const value = process.env['NEXT_PUBLIC_BACKEND_ENDPOINT']
  if (value.endsWith('/')) {
    return value.substr(0, value.length - 1)
  }
  return value
})

class BackendService {
  list<T>(resourceName: string): Promise<T[]> {
    return this.fetchApi({
      path: resourceName,
      method: 'get',
    })
  }

  find<T>(resourceName: string, id?: Id<T>): Promise<T> {
    return this.fetchApi({
      path: `${resourceName}/${id}`,
      method: 'get',
    })
  }

  create<T extends Model>(resourceName: string, data: ModelData<T>): Promise<T>
  create<D, T>(resourceName: string, data: D): Promise<T>
  async create<D, T>(resourceName: string, data: D): Promise<T> {
    return this.fetchApi({
      path: resourceName,
      method: 'post',
      body: data,
    })
  }

  private async fetchApi<T>(options: { path: string, method: string, body?: unknown }): Promise<T> {
    const res = await fetch(`${apiEndpoint}/api/v1/${options.path}`, {
      method: options.method,
      body: JSON.stringify(options.body),
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
