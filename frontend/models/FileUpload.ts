/**
 * `FileUpload` represents a file upload.
 */
export default interface FileUpload {
  /**
   * The file.
   */
  file: File

  /**
   * The file name.
   */
  name: string | null
}
