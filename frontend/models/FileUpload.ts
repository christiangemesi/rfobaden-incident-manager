import Id from '@/models/base/Id'

export default interface FileUpload {
  name: string
  file: File
}

export type FileId = Id<unknown>

export const getImageUrl = process.env.NODE_ENV === 'development'
  ? (id: FileId) =>  `http://backend-development:8080/api/v1/images/${id}`
  : (id: FileId) => `/api/v1/images/${id}`

export const getDocumentUrl = process.env.NODE_ENV === 'development'
  ? (id: FileId) =>  `localhost:3001/api/v1/documents/${id}`
  : (id: FileId) => `/api/v1/documents/${id}`

