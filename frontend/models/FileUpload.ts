import Id from '@/models/base/Id'

export default interface FileUpload {
  file: File
  name: string | null
}

export type FileId = Id<unknown>

export const getImageUrl = (id: FileId): string => (
  `http://backend-${process.env['NEXT_PUBLIC_RFO_STAGE']}:8080/api/v1/documents/${id}`
)

export const getDocumentUrl = process.env.NODE_ENV === 'development'
  ? (id: FileId) => `http://localhost:3001/api/v1/documents/${id}`
  : (id: FileId) => `/api/v1/documents/${id}`

