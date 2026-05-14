import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options })
}

function Providers({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

export * from '@testing-library/react'
export { customRender as render }
