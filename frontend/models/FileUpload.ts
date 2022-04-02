import Id from '@/models/base/Id'

export default interface FileUpload {
  title: string
  file: File | null
}

export type FileId = Id<unknown>