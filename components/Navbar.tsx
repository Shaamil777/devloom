"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Search, PenSquare, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className="border-b border-border bg-background relative z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto w-full gap-4">

                {/* 1. LEFT SECTION (Logo + Main Links) */}
                <div className="flex items-center gap-6 md:gap-8">
                    <Link href="/" className="font-bold text-xl tracking-tight hidden sm:block">
                        DevLoom
                    </Link>

                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <Link href="/blogs" className="hover:text-foreground transition-colors">Posts</Link>
                        <Link href="/saved" className="hover:text-foreground hidden sm:block transition-colors">Saved</Link>
                    </div>
                </div>

                {/* 2. CENTER SECTION (Search Bar) */}
                <div className="flex-1 flex justify-center max-w-md mx-auto hidden md:flex">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search posts..."
                            className="w-full pl-9 rounded-full bg-input border-border focus-visible:ring-ring"
                        />
                    </div>
                </div>

                {/* 3. RIGHT SECTION (Auth / Profile) */}
                <div className="flex items-center gap-4 ml-auto">
                    {status === "loading" ? (
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    ) : session ? (
                        <>
                            {/* Create Post Button */}
                            <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-full">
                                <Link href="/dashboard/write">
                                    <PenSquare className="h-4 w-4 mr-2" />
                                    Write
                                </Link>
                            </Button>

                            {/* User Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-80 transition">
                                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                            {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-1">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                                            {session.user?.email && (
                                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                    {session.user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button
                            onClick={() => signIn()}
                            className="rounded-full"
                        >
                            Sign In
                        </Button>
                    )}
                </div>

            </div>
        </nav >
    )
}
