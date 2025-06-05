"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ClipboardPlus, BarChartBig, Settings, LeafIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Logo from "@/components/Logo"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/harvest", label: "Harvest Log", icon: ClipboardPlus },
  { href: "/analysis", label: "Analysis", icon: BarChartBig },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
    <div className="p-4 border-b border-sidebar-border">
      <Link href="/">
        <Logo />
      </Link>
    </div>
    <SidebarMenu className="p-4">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              isActive={pathname === item.href}
              tooltip={{ children: item.label, className: "font-body" }}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-body">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
    </>
  )
}
