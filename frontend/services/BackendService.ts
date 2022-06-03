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

/**
 * The api's endpoint URL.
 */
const apiEndpoint = run(() => {
  if (typeof window === 'undefined') {
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

/**
 * `BackendService` defines ways to access the IncidentManager backend API.
 */
class BackendService {
  /**
   * The session token used to access the backend.
   * @private
   */
  private readonly sessionToken: string | null

  /**
   * Create a new {@link BackendService}.
   *
   * @param sessionToken The session token used to access the backend.
   */
  constructor(sessionToken: string | null = null) {
    this.sessionToken = sessionToken
  }

  /**
   * Checks if the service has a session token.
   */
  get hasSessionToken(): boolean {
    return this.sessionToken !== null
  }

  /**
   * Creates a new `BackendService` based on this one,
   * but with a specific {@link sessionToken}.
   *
   * @param sessionToken The new session token.
   */
  withSessionToken(sessionToken: string | null): BackendService {
    return new BackendService(sessionToken)
  }

  /**
   * Executes a GET request that expects an JSON array as response,
   * containing a list of entities.
   *
   * @param resourceName The name of the model to which the entities belong.
   * @return The list of entities, if loaded successfully.
   */
  list<T>(resourceName: string): Promise<BackendResponse<T[]>> {
    return this.fetchApi({
      path: resourceName,
      method: 'get',
    })
  }

  /**
   * Executes a GET request that expects a JSON object as response, containing a single, specific entity.
   *
   * @param resourceName The name of the model to which the entity belongs.
   * @param id The id of the entity.
   * @return The entity, if loaded successfully.
   */
  find<T>(resourceName: string, id?: Id<T>): Promise<BackendResponse<T>> {
    return this.fetchApi({
      path: `${resourceName}/${id ?? ''}`,
      method: 'get',
    })
  }

  /**
   * Executes a GET request.
   *
   * @param path The API path to fetch from.
   * @return The API response.
   */
  get<T>(path: string): Promise<BackendResponse<T>> {
    return this.fetchApi({
      path: path,
      method: 'get',
    })
  }

  /**
   * Executes a POST request to a specific resource,
   * while expecting to create a new entity.
   *
   * @param resourceName The name of the model to which the new entity will belong.
   * @param data The new entity's data.
   * @return The new entity, if it was successfully created.
   */
  create<T extends Model>(resourceName: string, data: ModelData<T>): Promise<BackendResponse<T>>

  /**
   * Executes a POST request to a specific resource,
   * while expecting to create a new entity.
   *
   * @param resourceName The name of the model to which the new entity will belong.
   * @param data The new entity's data.
   * @return The new entity, if it was successfully created.
   */
  create<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>>

  /**
   * Executes a POST request to a specific resource,
   * while expecting to create a new entity.
   *
   * @param resourceName The name of the model to which the new entity will belong.
   * @param data The new entity's data.
   * @return The new entity, if it was successfully created.
   */
  async create<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>> {
    return this.fetchApi({
      path: resourceName,
      method: 'post',
      body: data,
    })
  }

  /**
   * Executes a PUT request to a specific resource,
   * while expecting to update an existing entity.
   *
   * @param resourceName The name of the model to which the entity belongs.
   * @param id The id of the entity.
   * @param data The entity's new data.
   * @return The updated entity, if the update was successful.
   */
  async update<T>(resourceName: string, id: Id<T>, data: ModelData<T>): Promise<BackendResponse<T>>

  /**
   * Executes a PUT request to a specific singular resource,
   * while expecting to update that resource.
   *
   * @param resourceName The name of the resource.
   * @param data The resource's new data.
   * @return The updated resource.
   */
  async update<D, T>(resourceName: string, data: D): Promise<BackendResponse<T>>

  // Implementation of all `update` definitions.
  async update<D, T>(resourceName: string, idOrData: unknown, data?: D): Promise<BackendResponse<T>> {
    const [path, body] = data === undefined ? [resourceName, idOrData as D] : [`${resourceName}/${idOrData}`, data]
    return this.fetchApi({
      path,
      body,
      method: 'put',
    })
  }

  /**
   * Executes a DELETE request,
   * while expecting to delete an existing entity.
   *
   * @param resourceName The name of the model to which the entity belongs.
   * @param id The id of the entity.
   * @param params Additional URL parameters.
   */
  async delete(resourceName: string, id?: Id<never>, params?: Params): Promise<BackendError | null> {
    const [_data, error] = await this.fetchApi({
      path: `${resourceName}/${id ?? ''}`,
      method: 'delete',
      params,
    })
    return error
  }

  /**
   * Executes a POST request, attempting to upload a file.
   *
   * @param resourceName The name of the resource to which the file is uploaded.
   * @param file The file to upload.
   * @param params Additional URL parameters.
   * @return A document representing the uploaded document, if successful.
   */
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

  /**
   * Executes a backend API request.
   *
   * @param options The request options.
   * @return A {@link BackendResponse} containing the API response.
   * @private
   */
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

  /**
   * Maps a {@link Response fetch response} to a {@link BackendResponse}.
   *
   * @param res The fetch response.
   * @param map Parses the response body into a value.
   * @return The parsed response.
   * @private
   */
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

/**
 * {@code BackendResponse} contains data returned by the backend API.
 *
 * It is represented by an array of two elements.
 * The first element contains the response data, if the request was successful.
 * The second element contains the error returned on failure.
 */
export type BackendResponse<T> = [T, BackendError | null]

/**
 * {@code BackendError} represents an error returned by the backend API.
 */
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

/**
 * {@code BackendErrorFields} details the structure of a backend response error that
 * contains errors for individual fields.
 */
export interface BackendErrorFields {
  [field: string]: string[] | BackendErrorFields
}

/**
 * {@code ServerSideSessionHolder} is a value that holds a {@link ServerSideSession}.
 */
export interface ServerSideSessionHolder {
  session: ServerSideSession
}

/**
 * {@code ServerSideSession} contains the data used to execute authenticated backend request
 * on the server side.
 */
export interface ServerSideSession {
  user: User | null
  backendService: BackendService
}

/**
 * {@code Params} are additional URL parameters.
 */
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

/**
 * Loads a {@link ServerSideSession} from a {@link IncomingMessage}.
 *
 * @param req The message to load the session from.
 * @return The session.
 */
export const getSessionFromRequest = (req: IncomingMessage): ServerSideSession => {
  const { session } = req as unknown as ServerSideSessionHolder
  if (session === undefined) {
    throw new Error('request does not contain a serverside session')
  }
  return session
}

/**
 * Checks if a backend error hints at an expired session.
 *
 * @param error The error to check.
 */
const isSessionExpiryError = (error: BackendError): boolean => {
  return error.status === 401 && error.error === 'token expired'
}
