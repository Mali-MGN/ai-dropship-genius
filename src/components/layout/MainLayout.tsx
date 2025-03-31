
import type { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
}
