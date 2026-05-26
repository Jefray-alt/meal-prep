export interface TagPillsProps {
  error?: string
  existingTags?: string[]
  isLoadingTags?: boolean
  onChange: (value: string[]) => void
  tagsLoadError?: boolean
  value: string[]
}
