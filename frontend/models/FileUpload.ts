import Id from '@/models/base/Id'

export default interface FileUpload {
  file: File
  name: string | null
}

export interface Document {
  id: Id<this>
  name: string
  mimeType: string
  extension: string
}

export type FileId = Id<unknown>

export const getImageUrl = (id: Id<Document>): string =>
  `http://backend-${process.env['NEXT_PUBLIC_RFO_STAGE']}:8080/api/v1/documents/${id}`

export const getDocumentUrl =
  process.env.NODE_ENV === 'development'
    ? (id: Id<Document>) => `http://localhost:3001/api/v1/documents/${id}`
    : (id: Id<Document>) => `/api/v1/documents/${id}`
