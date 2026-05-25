import { Dropdown } from '@heroui/react'

import type { UserMenuProps } from './UserMenu.types'

export default function UserMenu({ onLogoutClick }: UserMenuProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Account menu"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-bark/20 bg-ash/50 text-smoke/60 transition-all duration-200 hover:border-bark/35 hover:bg-ash hover:text-bark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50"
      >
        <svg aria-hidden="true" fill="currentColor" height={14} viewBox="0 0 16 16" width={14} xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z" />
        </svg>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu>
          <Dropdown.Item id="profile" textValue="Profile">
            Profile
          </Dropdown.Item>
          <Dropdown.Item id="logout" onAction={onLogoutClick} textValue="Logout">
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
