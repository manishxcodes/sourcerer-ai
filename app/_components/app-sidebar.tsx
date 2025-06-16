"use client"

import { Compass, GalleryHorizontalEnd, Home } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Discover",
    url: "/discover",
    icon: Compass,
  },
  {
    title: "Library",
    url: "/library",
    icon: GalleryHorizontalEnd,
  },
]

export function AppSidebar() {
    const path = usePathname();


    return (
        <Sidebar>
            <SidebarHeader className="text-lg font-mono">Sourcerer</SidebarHeader>
            <SidebarContent className="mt-2">
                <SidebarGroup>
                {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
                <SidebarGroupContent>
                    <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} >
                        <SidebarMenuButton asChild className={`hover:bg-transparent hover:text-accent hover:scale-105 transition-transform duration-150 ${path?.includes(item.url) && 'font-semibold text-primary' }`}>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button>Sign In</Button>
            </SidebarFooter>
        </Sidebar>
    )
}