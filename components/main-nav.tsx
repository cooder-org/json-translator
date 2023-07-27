import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/endpoints"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Endpoints
      </Link>
      <Link
        href="/playground"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Playground
      </Link>
    </nav>
  )
}