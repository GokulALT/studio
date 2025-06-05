"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Logo from "@/components/Logo"

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Logo className="hidden md:flex"/>
      </div>
      {/* Placeholder for User Profile/Actions if needed later */}
      <div>
         {/* <UserNav /> */}
      </div>
    </header>
  )
}
