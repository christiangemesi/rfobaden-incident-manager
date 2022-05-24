import Id from '@/models/base/Id'

/**
 * `Document` represents an uploaded file.
 */
export default interface Document {

  /**
   * Uniquely identifies the `document`.
   */
  id: Id<this>

  /**
   * The name of the `document`.
   */
  name: string

  /**
   * The mime type of the `document`.
   */
  mimeType: string

  /**
   * The extension of the `document` based on its `mimeType`.
   */
  extension: string
}

export const getImageUrl = (document: Document): string =>
  `http://backend-${process.env['NEXT_PUBLIC_RFO_STAGE']}:8080/api/v1/documents/${document.id}`

export const getDocumentUrl =
  process.env.NODE_ENV === 'development'
    ? (document: Document) => `http://localhost:3001/api/v1/documents/${document.id}`
    : (document: Document) => `/api/v1/documents/${document.id}`

export const parseDocument = (data: Document): Document => {
  return {
    ...data,
  }
}
