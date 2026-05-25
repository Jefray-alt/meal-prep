import { Navigate } from 'react-router'

import type { GuestRouteProps } from './GuestRoute.types'

import { TOKEN_KEY } from '../../lib/constants'

export default function GuestRoute({ children }: GuestRouteProps) {
  if (localStorage.getItem(TOKEN_KEY)) {
    return <Navigate replace to="/" />
  }
  return <>{children}</>
}
