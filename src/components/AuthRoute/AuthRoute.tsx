import { Navigate } from 'react-router'

import type { AuthRouteProps } from './AuthRoute.types'

import { TOKEN_KEY } from '../../lib/constants'

export default function AuthRoute({ children }: AuthRouteProps) {
  if (!localStorage.getItem(TOKEN_KEY)) {
    return <Navigate replace to="/login" />
  }
  return <>{children}</>
}
