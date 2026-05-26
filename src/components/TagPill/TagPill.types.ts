export interface Tag {
  id: string
  name: string
}

export interface TagPillProps {
  onRemove: (tag: Tag) => void
  tag: Tag
}
