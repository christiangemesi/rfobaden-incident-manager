import Model, { ModelData } from '@/models/base/Model'
import { run } from '@/utils/control-flow'
import Id from '@/models/base/Id'
import { IncomingMessage } from 'http'
import { SessionResponse } from '@/models/Session'
import User, { parseUser } from '@/models/User'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import FormData from 'form-data'
import AlertStore from '@/stores/AlertStore'
import Document from '@/models/Document'

const apiEndpoint = run(() => {
  if (!process.browser) {
    const stage = process.env['RFO_STAGE']
    return `http://backend-${stage}:8080`
  }
  const value = process.env['NEXT_PUBLIC_RFO_BACKEND_URL']
  if (value === undefined) {
    return ''
  }
  if (value.endsWith('/')) {
    return value.substr(0, value.length - 1)
  }
  return value
})

class BackendService {
  private readonly sessionToken: string | null

  constructor(sessionToken: string | null = null) {
    this.sessionToken = sessionToken
  }

  get hasSessionToken(): boolean {
    return this.sessionToken !== null
  }

  withSessionToken(sessionToken: string | null): BackendService {
    return new BackendService(sessionToken)
  }

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

  async update<T>(resourceName: string, id: Id<T>, data: ModelData<T>): Promise<BackendResponse<T>>
  async update<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>>
  async update<D, T>(resourceName: string, idOrData: unknown, data?: D): Promise<BackendResponse<T>> {
    const [path, body] = data === undefined ? [resourceName, idOrData as D] : [`${resourceName}/${idOrData}`, data]
    return this.fetchApi({
      path,
      body,
      method: 'put',
    })
  }

  async delete(resourceName: string, id?: Id<never>, params?: Params): Promise<BackendError | null> {
    const [_data, error] = await this.fetchApi({
      path: `${resourceName}/${id ?? ''}`,
      method: 'delete',
      params,
    })
    return error
  }

  async upload(resourceName: string, file: File, params?: Params): Promise<BackendResponse<Document>> {
    const body = new FormData()
    body.append('file', file)
    return this.fetchApi({
      path: resourceName,
      method: 'post',
      body,
      params,
    })
  }

  private async fetchApi<T>(options: {
    path: string
    method: string
    body?: unknown
    params?: Params
  }): Promise<BackendResponse<T>> {
    const headers: Record<string, string> = {}
    if (this.sessionToken !== null) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`
    }

    let body = options?.body
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    const url = new URL(`${apiEndpoint}/api/v1/${options.path}`)
    for (const [key, value] of Object.entries(options.params ?? {})) {
      if (value == null) {
        continue
      }
      url.searchParams.append(key, value.toString())
    }

    const res = await fetch(url.toString(), {
      method: options.method,
      body: body as BodyInit,
      mode: 'cors',
      // Required for sending cross-origin cookies.
      credentials: 'include',
      headers,
    })
    return await this.handleResponse(res, async () => {
      if (res.headers.get('content-type') === 'application/json') {
        const value: T = await res.json()
        return value
      }
      return null as unknown as T
    })
  }

  private async handleResponse<T>(res: Response, map: (res: Response) => T | Promise<T>): Promise<BackendResponse<T>> {
    if (res.status < 200 || 299 < res.status) {
      if (res.status >= 400 && res.status <= 499) {
        // Error is caused by the client (us).
        // Let the caller handle it.
        const data: { message: string; fields: BackendErrorFields | undefined } = await res.json()
        const error = new BackendError(res.status, data.message, data.fields ?? null)
        return [null as unknown as T, error]
      }
      const msg = await res.text()
      AlertStore.add({ text: `Anfrage fehlgeschlagen: [${res.status}] ${res.statusText}`, type: 'error', isFading: false })
      throw new Error(`backend request failed: [${res.status}] ${msg}`)

    }
    return [await map(res), null]
  }
}
export default new BackendService()

export type BackendResponse<T> = [T, BackendError | null]

export class BackendError extends Error {
  constructor(public status: number, public error: string, public fields: BackendErrorFields | null) {
    super(`[${status}] ${error}${BackendError.makeFieldsMessage(fields)}`)
  }

  private static makeFieldsMessage(fields: BackendErrorFields | null): string {
    if (fields == null) {
      return ''
    }
    let message = ''
    for (const field of Object.keys(fields)) {
      if (message.length !== 0) {
        message += ', '
      }
      const value = fields[field]
      if (Array.isArray(value)) {
        message += `${field}: [${value.join(', ')}]`
      } else {
        message += `${field}: ${this.makeFieldsMessage(value)}`
      }
    }
    return ` (${message})`
  }
}

export interface BackendErrorFields {
  [field: string]: string[] | BackendErrorFields
}

export interface ServerSideSessionHolder {
  session: ServerSideSession
}

export interface ServerSideSession {
  user: User | null
  backendService: BackendService
}

type Params = Record<string, { toString(): string } | null>

/**
 * Loads the current session from a request made to the nextjs server.
 * This works by reading the cookie that is also sent to the API, and reusing the token it contains.
 *
 * @param req The nextjs request object.
 * @param defaultService The BackendService instance used when no session could be found.
 */
export const loadSessionFromRequest = async (
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  defaultService: BackendService
): Promise<ServerSideSession> => {
  const sessionToken = req.cookies['rfobaden.incidentmanager.session.token'] ?? null
  if (sessionToken === null) {
    return { user: null, backendService: defaultService }
  }
  const backendService = new BackendService(sessionToken)
  const [sessionData, error] = await backendService.find<SessionResponse>('session')
  if (error !== null) {
    if (isSessionExpiryError(error)) {
      return { user: null, backendService: defaultService }
    }
    throw error
  }
  if (sessionData == null || sessionData.user == null) {
    return { user: null, backendService: defaultService }
  }
  const user = parseUser(sessionData.user)
  return { user, backendService }
}

export const getSessionFromRequest = (req: IncomingMessage): ServerSideSession => {
  const { session } = req as unknown as ServerSideSessionHolder
  if (session === undefined) {
    throw new Error('request does not contain a serverside session')
  }
  return session
}

const isSessionExpiryError = (error: BackendError): boolean => {
  return error.status === 401 && error.error === 'token expired'
}
