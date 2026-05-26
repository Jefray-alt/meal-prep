import { Chip, useOverlayState } from '@heroui/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { logout } from '../../lib/auth/auth'
import { TOKEN_KEY } from '../../lib/constants'
import LogoutConfirmModal from '../LogoutConfirmModal/LogoutConfirmModal'
import UserMenu from '../UserMenu/UserMenu'

export default function Header() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY)
  const logoutModalState = useOverlayState()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    await logout().catch(() => {})
    setIsLoggingOut(false)
    logoutModalState.close()
    void navigate('/login')
  }

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-bark/10 px-6 py-4">
      <Link className="flex items-center gap-3" to="/">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-ember/40 text-sm text-ember select-none">
          ◈
        </div>
        <span
          className="text-2xl font-light tracking-[0.15em] text-bark"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          mise
        </span>
        <Chip
          className="rounded border border-ember/25 px-1.5 py-px text-[9px] tracking-[0.15em] uppercase text-ember/90"
          color="accent"
          size="sm"
          variant="tertiary"
        >
          beta
        </Chip>
      </Link>

      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <>
            <Link
              className="group flex items-center gap-2 rounded-full border border-ember/30 bg-ember/6 px-4 py-1.5 text-[10px] tracking-[0.2em] text-bark/80 uppercase shadow-[0_0_0_0_rgba(232,115,58,0)] transition-all duration-200 hover:border-ember/55 hover:bg-ember/10 hover:text-bark hover:shadow-[0_0_18px_rgba(232,115,58,0.1)]"
              to="/meal-preps"
            >
              <span
                aria-hidden="true"
                className="text-ember/85 transition-colors duration-200 group-hover:text-ember"
              >
                ◫
              </span>
              My Preps
            </Link>
            <UserMenu onLogoutClick={() => { logoutModalState.open() }} />
          </>
        ) : (
          <Link
            className="rounded-full border border-smoke/20 px-4 py-1.5 text-[10px] tracking-[0.2em] text-smoke/60 uppercase transition-all duration-200 hover:border-smoke/40 hover:text-smoke/90"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>

      <LogoutConfirmModal
        isLoggingOut={isLoggingOut}
        onCancel={() => { logoutModalState.close() }}
        onConfirm={() => { void handleLogoutConfirm() }}
        state={logoutModalState}
      />
    </header>
  )
}
