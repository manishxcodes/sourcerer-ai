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
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"

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
    const { user } = useUser();

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
                        <SidebarMenuButton asChild className={`hover:bg-transparent hover:text-accent hover:scale-105 transition-transform duration-150 ${path === item.url && 'font-semibold text-primary' }`}>
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
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
             </SignedOut>
             <SignedIn>
              <div className="flex py-2 px-2">
                <UserButton />
                <p className="ml-2">{user?.fullName}</p>
              </div>
              <SignOutButton>
                <Button>Sign Out</Button>
              </SignOutButton>
             </SignedIn>
            </SidebarFooter>
        </Sidebar>
    )
}