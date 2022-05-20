import Id from '@/models/base/Id'

/**
 * `Document` represents a document like a PDF or an image like a png or jpg.
 */
export default interface Document {

  /**
   * An unique identifier for each `Document`.
   */
  id: Id<this>

  /**
   * The name of a `Document`.
   */
  name: string

  /**
   * The mime type of `Document`.
   */
  mimeType: string

  /**
   * The extension of `Document` representing a `mimeType`.
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
