/**
 * `FileUpload` represents a file that gets uploaded to the backend.
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
