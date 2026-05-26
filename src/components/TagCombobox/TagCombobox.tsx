import { Button, ComboBox, Input, ListBox, ListBoxItem } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAsyncList } from 'react-stately'

import type { Tag, TagComboboxProps } from './TagCombobox.types'

import { apiFetch } from '../../lib/apiFetch'
import TagPill from '../TagPill/TagPill'

export default function TagCombobox({ error, onTagRemove, onTagSelect, value }: TagComboboxProps) {
  const [inputValue, setInputValue] = useState('')
  const debounceRef = useRef<null | ReturnType<typeof setTimeout>>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasMoreRef = useRef(false)

  const list = useAsyncList<Tag, number>({
    async load({ cursor, filterText, signal }) {
      const offset = cursor ?? 0
      const params = new URLSearchParams({ limit: '10', offset: String(offset) })
      if (filterText?.trim()) params.set('search', filterText.trim())
      const res = await apiFetch(`/tags?${params}`, { signal })
      if (!res.ok) throw new Error('Failed to load tags')
      const body = (await res.json()) as { data: Tag[]; hasMore: boolean }
      hasMoreRef.current = body.hasMore
      return {
        cursor: body.hasMore ? offset + 10 : undefined,
        items: body.data,
      }
    },
  })

  const listRef = useRef(list)
  useEffect(() => {
    listRef.current = list
  })

  const sentinelCallbackRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (!node) return
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !listRef.current.isLoading && hasMoreRef.current) {
        listRef.current.loadMore()
      }
    })
    observerRef.current.observe(node)
  }, [])

  const handleInputChange = (val: string) => {
    setInputValue(val)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      list.setFilterText(val)
    }, 300)
  }

  const handleSelect = (key: null | number | string) => {
    if (!key) return
    const tag = list.items.find((t) => t.id === String(key))
    if (!tag) return
    onTagSelect(tag)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    setInputValue('')
    list.setFilterText('')
  }

  const disabledKeys = value.map((t) => t.id)
  const displayItems = list.error ? [] : list.items

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] tracking-[0.25em] text-smoke/60 uppercase">Tags</span>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <TagPill key={tag.id} onRemove={onTagRemove} tag={tag} />
          ))}
        </div>
      )}

      <ComboBox
        allowsEmptyCollection
        disabledKeys={disabledKeys}
        fullWidth
        inputValue={inputValue}
        items={displayItems}
        menuTrigger="focus"
        onChange={handleSelect}
        onInputChange={handleInputChange}
      >
        <ComboBox.InputGroup>
          <Input fullWidth placeholder="Search tags…" />
          <ComboBox.Trigger>▼</ComboBox.Trigger>
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox
            aria-busy={list.isLoading}
            renderEmptyState={() => {
              if (list.error) {
                return (
                  <div className="flex flex-col gap-2 p-3">
                    <p className="text-xs text-red-400">Failed to load tags. Try again.</p>
                    <Button
                      className="h-auto w-fit px-0 text-xs text-smoke/60"
                      onPress={() => { list.reload() }}
                      variant="ghost"
                    >
                      Retry
                    </Button>
                  </div>
                )
              }
              if (list.isLoading) return null
              return <p className="p-3 text-xs text-smoke/60">No tags found</p>
            }}
          >
            {(item: Tag) => (
              <ListBoxItem id={item.id} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </ListBox>
          <div aria-hidden="true" ref={sentinelCallbackRef} />
        </ComboBox.Popover>
      </ComboBox>
    </div>
  )
}
