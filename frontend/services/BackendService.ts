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
  list<T>(resourceName: string): Promise<BackendResponse<T[]>> {
    return this.fetchApi({
      path: resourceName,
      method: 'get',
    })
  }

  find<T>(resourceName: string, id?: Id<T>): Promise<BackendResponse<T>> {
    return this.fetchApi({
      path: `${resourceName}/${id ?? ''}`,
      method: 'get',
    })
  }

  create<T extends Model>(resourceName: string, data: ModelData<T>): Promise<BackendResponse<T>>
  create<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>>
  async create<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>> {
    return this.fetchApi({
      path: resourceName,
      method: 'post',
      body: data,
    })
  }

  async delete(resourceName: string, id?: Id<never>): Promise<BackendError | null> {
    const [_data, error] = await this.fetchApi({
      path: `${resourceName}/${id ?? ''}`,
      method: 'delete',
    })
    return error
  }

  private async fetchApi<T>(options: { path: string, method: string, body?: unknown }): Promise<BackendResponse<T>> {
    const res = await fetch(`${apiEndpoint}/api/v1/${options.path}`, {
      method: options.method,
      body: JSON.stringify(options.body),
      mode: 'cors',
      // Required for sending cross-origin cookies.
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status < 200 || 299 < res.status) {
      if (res.status >= 400 && res.status <= 499) {
        // Error is caused by the client (us).
        // Let the caller handle it.
        const data: { message: string } = await res.json()
        const error = new BackendError(res.status, data.message)
        return [null, error]
      }
      // TODO error handling
      throw new Error(`backend request failed: ${await res.text()}`)
    }
    if (res.headers.get('content-type') === 'application/json') {
      const value: T = await res.json()
      return [value, null]
    }
    return [null, null]
  }
}
export default new BackendService()

export type BackendResponse<T> =
  | [null, BackendError]
  | [T, null]

export class BackendError extends Error {
  constructor(public status: number, public error: string) {
    super(`[${status}] ${error}`)
  }
}


