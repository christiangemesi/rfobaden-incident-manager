import Id from '@/models/base/Id'

export default interface FileUpload {
  name: string
  file: File
}

export type FileId = Id<unknown>