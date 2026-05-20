import { Navigate } from 'react-router'

import type { GuestRouteProps } from './GuestRoute.types'

export default function GuestRoute({ children }: GuestRouteProps) {
  if (localStorage.getItem('mise_access_token')) {
    return <Navigate replace to="/" />
  }
  return <>{children}</>
}
