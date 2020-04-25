export interface PostMetadata {
  title: string
  titlePath: string
  published: number
  id: string
  markdown?: string
}

export interface DraftMetadata {
  id: string
  saved: number
  title: string
  markdown?: string
}
