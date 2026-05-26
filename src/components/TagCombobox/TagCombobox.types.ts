import type { Tag } from '../TagPill/TagPill.types'

export type { Tag }

export interface TagComboboxProps {
  error?: string
  onTagRemove: (tag: Tag) => void
  onTagSelect: (tag: Tag) => void
  value: Tag[]
}
