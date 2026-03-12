"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    LayoutDashboard,
    Users,
    FileText,
    Tags,
    LogOut,
    ChevronRight,
    Loader2,
    Menu,
    X,
    ShieldAlert,
    TrendingUp,
    Activity,
    Plus,
    Edit2,
    Save
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type AdminTab = "overview" | "users" | "posts" | "tags"

interface AdminStats {
    totalUsers: number
    totalPosts: number
    totalComments: number
    totalTags: number
    activityData: { name: string; users: number; posts: number }[]
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<AdminTab>("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Redirect non-admins
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/admin")
        } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
            router.push("/")
        }
    }, [status, session, router])

    // Fetch Global Stats
    const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await fetch("/api/admin/stats")
            if (!res.ok) throw new Error("Failed to fetch admin stats")
            return res.json()
        },
        enabled: status === "authenticated" && session?.user?.role === "ADMIN",
    })

    if (status === "loading") {
        return (
            <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        )
    }

    if (!session || session.user?.role !== "ADMIN") return null

    const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: "overview", label: "Global Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: "users", label: "Manage Users", icon: <Users className="h-4 w-4" /> },
        { id: "posts", label: "Manage Posts", icon: <FileText className="h-4 w-4" /> },
        { id: "tags", label: "Manage Tags", icon: <Tags className="h-4 w-4" /> },
    ]

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="flex max-w-7xl mx-auto">
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                >
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Sidebar overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed lg:sticky top-0 lg:top-0 left-0 z-40 lg:z-auto
                        h-screen lg:h-[calc(100vh-4rem)]
                        w-72 lg:w-64 shrink-0
                        bg-card lg:bg-transparent
                        border-r border-border
                        flex flex-col
                        p-5
                        transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `}
                >
                    {/* Admin Badge Info */}
                    <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <Avatar className="h-11 w-11 border-2 border-orange-500/20 shadow-sm">
                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "Admin"} />
                            <AvatarFallback className="bg-orange-500/90 text-white font-bold">
                                {session.user?.name?.charAt(0).toUpperCase() || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground flex items-center gap-1.5 truncate">
                                {session.user?.name}
                                <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
                            </p>
                            <p className="text-xs text-orange-500/80 font-medium tracking-wider uppercase">Administrator</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id)
                                    setSidebarOpen(false)
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-all duration-200 group
                                    ${activeTab === item.id
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                    }
                                `}
                            >
                                <span className={`transition-colors ${activeTab === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                <ChevronRight className={`h-3.5 w-3.5 ml-auto transition-all ${activeTab === item.id ? "opacity-100 translate-x-0 text-primary" : "opacity-0 -translate-x-2"}`} />
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="border-t border-border pt-4 space-y-1">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        >
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-3 h-4 w-4" />
                                Return to User Dashboard
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Log Out
                        </Button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                    {activeTab === "overview" && (
                        <OverviewTab stats={stats} statsLoading={statsLoading} user={session.user} />
                    )}
                    {activeTab === "users" && (
                        <UsersTab />
                    )}
                    {activeTab === "posts" && (
                        <PostsTab />
                    )}
                    {activeTab === "tags" && (
                        <TagsTab />
                    )}
                </main>
            </div>
        </div>
    )
}

/* ==========================
   OVERVIEW TAB
   ========================== */
function OverviewTab({
    stats,
    statsLoading,
    user,
}: {
    stats?: AdminStats
    statsLoading: boolean
    user: any
}) {
    const statCards = [
        {
            label: "Total Platform Users",
            value: stats?.totalUsers ?? 0,
            icon: <Users className="h-5 w-5" />,
            color: "from-blue-500/20 to-blue-600/5",
            iconColor: "text-blue-400",
            border: "border-blue-500/20",
        },
        {
            label: "Published Posts",
            value: stats?.totalPosts ?? 0,
            icon: <FileText className="h-5 w-5" />,
            color: "from-purple-500/20 to-purple-600/5",
            iconColor: "text-purple-400",
            border: "border-purple-500/20",
        },
        {
            label: "Total Comments",
            value: stats?.totalComments ?? 0,
            icon: <Users className="h-5 w-5" />,
            color: "from-emerald-500/20 to-emerald-600/5",
            iconColor: "text-emerald-400",
            border: "border-emerald-500/20",
        },
        {
            label: "Unique Tags",
            value: stats?.totalTags ?? 0,
            icon: <Tags className="h-5 w-5" />,
            color: "from-amber-500/20 to-amber-600/5",
            iconColor: "text-amber-400",
            border: "border-amber-500/20",
        },
    ]

    // Dynamic engagement data tailored for visual representation
    const platformActivityData = stats?.activityData || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    System Overview
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    High-level statistics for the DevLoom platform.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`relative overflow-hidden rounded-xl border ${stat.border} bg-gradient-to-br ${stat.color} p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
                    >
                        <div className={`${stat.iconColor} mb-3 opacity-80`}>{stat.icon}</div>
                        <p className="text-3xl font-extrabold text-foreground">
                            {statsLoading ? (
                                <span className="inline-block h-8 w-16 bg-muted rounded animate-pulse" />
                            ) : (
                                stat.value.toLocaleString()
                            )}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Activity Chart Section */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">System Activity Engine</h2>
                </div>
                
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={platformActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.2} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'oklch(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                            <Area type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPosts)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions / Info */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-2xl border border-border bg-card/50">
                    <h3 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert className="h-5 w-5 text-orange-500"/> Admin Privileges</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You are currently viewing DevLoom as an Administrator. This grants you the ability to view all system metrics, manage user accounts, moderate posts, and oversee platform tags. Any destructive actions taken in this portal are permanent.
                    </p>
                </div>
                 <div className="p-6 rounded-2xl border border-border bg-primary/5">
                    <h3 className="font-bold flex items-center gap-2 mb-2">Quick Navigation</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Manage offensive or spam posts in the <strong>Posts Tab</strong>.</li>
                        <li>• Promote other users to administrators in the <strong>Users Tab</strong>.</li>
                        <li>• Clean up duplicate or misspelled categories in the <strong>Tags Tab</strong>.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

/* ==========================
   USERS TAB
   ========================== */
function UsersTab() {
    const { data: session } = useSession()
    
    // Fetch users
    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const res = await fetch("/api/admin/users")
            if (!res.ok) throw new Error("Failed to fetch users")
            return res.json()
        }
    })

    // Update role
    const updateRole = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole })
            })
            if (res.ok) refetch()
        } catch (error) {
            console.error("Failed to update role", error)
        }
    }

    // Delete user
    const deleteUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            })
            if (res.ok) refetch()
        } catch (error) {
            console.error("Failed to delete user", error)
        }
    }

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-64 w-full bg-muted/50 rounded-xl"></div>
        </div>
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1 text-sm">View, manage, and assign roles to platform members.</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card/50 overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">User</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Joined Date</th>
                            <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Engagement</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                            <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users?.map((u: any) => (
                            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                                            <AvatarImage src={u.image} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{u.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-foreground whitespace-nowrap">{u.name}</div>
                                            <div className="text-xs text-muted-foreground whitespace-nowrap">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-4 text-muted-foreground text-xs font-medium">
                                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md" title="Total Posts">
                                            <FileText className="h-3 w-3 text-purple-400" />
                                            {u._count.posts}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md" title="Total Comments">
                                            <Activity className="h-3 w-3 text-emerald-400" />
                                            {u._count.comments}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className={u.role === "ADMIN" ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent" : "bg-secondary text-secondary-foreground"}>
                                        {u.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {u.role === "ADMIN" ? (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => updateRole(u.id, "USER")} 
                                                disabled={session?.user?.id === u.id} 
                                                title={session?.user?.id === u.id ? "Cannot demote yourself" : "Demote to User"}
                                            >
                                                Demote
                                            </Button>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:text-orange-600" 
                                                onClick={() => updateRole(u.id, "ADMIN")} 
                                                title="Promote to Admin"
                                            >
                                                Promote
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" disabled={session?.user?.id === u.id} title={session?.user?.id === u.id ? "Cannot delete yourself" : "Delete User"}>
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will completely obliterate <strong>{u.name}'s</strong> account and everything they have ever created (posts, comments, likes). This destructive action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteUser(u.id)} className="bg-destructive hover:bg-destructive/90 text-white">
                                                        Permanently Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* ==========================
   POSTS TAB
   ========================== */
function PostsTab() {
    const { data: posts, isLoading, refetch } = useQuery({
        queryKey: ["admin-posts"],
        queryFn: async () => {
            const res = await fetch("/api/admin/posts")
            if (!res.ok) throw new Error("Failed to fetch posts")
            return res.json()
        }
    })

    const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !currentStatus })
            })
            if (res.ok) refetch()
        } catch (error) {
            console.error("Failed to update post status", error)
        }
    }

    const deletePost = async (postId: string) => {
        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: "DELETE",
            })
            if (res.ok) refetch()
        } catch (error) {
            console.error("Failed to delete post", error)
        }
    }

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-64 w-full bg-muted/50 rounded-xl"></div>
        </div>
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Post Moderation</h1>
                <p className="text-muted-foreground mt-1 text-sm">Review published content and manage platform spam.</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card/50 overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Article Info</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Author</th>
                            <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Engagement</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {posts?.map((p: any) => (
                            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 min-w-[300px] max-w-[400px]">
                                    <div className="font-medium text-foreground line-clamp-1 mb-1">{p.title}</div>
                                    <div className="text-xs text-muted-foreground">Created: {new Date(p.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 border border-border shadow-sm">
                                            <AvatarImage src={p.author.image} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{p.author.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">{p.author.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex justify-center gap-4 text-muted-foreground text-xs font-medium">
                                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md" title="Total Likes">
                                            <Activity className="h-3 w-3 text-red-400" />
                                            {p._count.likes}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md" title="Total Comments">
                                            <FileText className="h-3 w-3 text-emerald-400" />
                                            {p._count.comments}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={p.published ? "default" : "secondary"} className={p.published ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none hover:bg-emerald-500/20" : "bg-muted text-muted-foreground border-transparent"}>
                                        {p.published ? "Published" : "Draft"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild size="sm" variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                                            <Link href={`/blogs/${p.slug}`} target="_blank">View</Link>
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => togglePublishStatus(p.id, p.published)}
                                            className={p.published ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600" : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"}
                                        >
                                            {p.published ? "Unpublish" : "Publish"}
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will completely destroy the post <strong>{p.title}</strong> along with all of its comments and likes. This action cannot be prevented or reversed.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deletePost(p.id)} className="bg-destructive hover:bg-destructive/90 text-white">
                                                        Permanently Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* ==========================
   TAGS TAB
   ========================== */
function TagsTab() {
    const [newTagName, setNewTagName] = useState("")
    const [editingTag, setEditingTag] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")

    const { data: tags, isLoading, refetch } = useQuery({
        queryKey: ["admin-tags"],
        queryFn: async () => {
            const res = await fetch("/api/admin/tags")
            if (!res.ok) throw new Error("Failed to fetch tags")
            return res.json()
        }
    })

    const createTag = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTagName.trim()) return
        
        try {
            const res = await fetch("/api/admin/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTagName, slug: newTagName })
            })
            if (res.ok) {
                setNewTagName("")
                refetch()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const startEditing = (tag: any) => {
        setEditingTag(tag.id)
        setEditValue(tag.name)
    }

    const saveEdit = async (id: string) => {
        if (!editValue.trim()) return
        try {
            const res = await fetch(`/api/admin/tags/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editValue, slug: editValue })
            })
            if (res.ok) {
                setEditingTag(null)
                refetch()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteTag = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/tags/${id}`, {
                method: "DELETE"
            })
            if (res.ok) refetch()
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-40 w-full bg-muted/50 rounded-xl"></div>
        </div>
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tag Management</h1>
                <p className="text-muted-foreground mt-1 text-sm">Create boundaries and categories for the platform's content engine.</p>
            </div>

            {/* Quick Create Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <form onSubmit={createTag} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-foreground">Create New Tag</label>
                        <Input 
                            placeholder="e.g. Next.js, Web3, Career..." 
                            value={newTagName} 
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full max-w-md bg-background"
                        />
                    </div>
                    <Button type="submit" disabled={!newTagName.trim()} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Tag
                    </Button>
                </form>
            </div>

            {/* Interactive Tags Table */}
            <div className="rounded-xl border border-border bg-card/50 overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Tag Name</th>
                            <th className="px-6 py-4 font-semibold">URL Slug</th>
                            <th className="px-6 py-4 font-semibold text-center">Assigned Posts</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tags?.map((t: any) => (
                            <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    {editingTag === t.id ? (
                                        <Input 
                                            value={editValue} 
                                            onChange={(e) => setEditValue(e.target.value)} 
                                            className="h-8 w-[200px]"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEdit(t.id)
                                                if (e.key === 'Escape') setEditingTag(null)
                                            }}
                                        />
                                    ) : (
                                        <div className="font-semibold text-foreground flex items-center gap-2">
                                            <Tags className="h-4 w-4 text-primary opacity-70" /> {t.name}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    <Badge variant="outline" className="font-mono text-xs bg-muted/50">/{t.slug}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex justify-center">
                                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md text-muted-foreground font-medium text-xs flex-col">
                                            <FileText className="h-3 w-3 text-purple-400" />
                                            {t._count.posts}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {editingTag === t.id ? (
                                            <>
                                                <Button size="sm" variant="default" onClick={() => saveEdit(t.id)} className="gap-1.5 h-8">
                                                    <Save className="h-3 w-3" /> Save
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingTag(null)} className="h-8">
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button size="sm" variant="ghost" onClick={() => startEditing(t)} className="gap-1.5 h-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                                                <Edit2 className="h-3 w-3" /> Edit
                                            </Button>
                                        )}
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" className="h-8">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Scrap this category?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will completely delete the <strong>{t.name}</strong> tag. While this won't delete the posts assigned to it, it will rip this category off of all {t._count.posts} posts.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteTag(t.id)} className="bg-destructive hover:bg-destructive/90 text-white">
                                                        Permanently Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
