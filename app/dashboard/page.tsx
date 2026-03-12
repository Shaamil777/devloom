"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    FileText,
    User,
    PenSquare,
    Trash2,
    Heart,
    MessageSquare,
    Bookmark,
    Eye,
    TrendingUp,
    LogOut,
    ChevronRight,
    Loader2,
    ImageIcon,
    Menu,
    X,
    ExternalLink,
} from "lucide-react"

type TabType = "overview" | "posts" | "settings"

interface UserStats {
    totalPosts: number
    totalLikes: number
    totalComments: number
    totalSaved: number
}

interface UserPost {
    id: string
    title: string
    slug: string
    content: string
    coverImage: string | null
    published: boolean
    createdAt: string
    updatedAt: string
    tags: { tag: { id: string; name: string; slug: string } }[]
    _count: { likes: number; comments: number; savedBy: number }
}

interface UserData {
    id: string
    name: string | null
    email: string | null
    image: string | null
    createdAt: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState<TabType>("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Profile form state
    const [profileName, setProfileName] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/dashboard")
        }
    }, [status, router])

    // Fetch user data
    const { data: userData } = useQuery<UserData>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch("/api/me")
            if (!res.ok) throw new Error("Failed to fetch user")
            return res.json()
        },
        enabled: status === "authenticated",
    })

    // Fetch stats
    const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
        queryKey: ["me-stats"],
        queryFn: async () => {
            const res = await fetch("/api/me/stats")
            if (!res.ok) throw new Error("Failed to fetch stats")
            return res.json()
        },
        enabled: status === "authenticated",
    })

    // Fetch user posts
    const { data: posts = [], isLoading: postsLoading } = useQuery<UserPost[]>({
        queryKey: ["me-posts"],
        queryFn: async () => {
            const res = await fetch("/api/me/posts")
            if (!res.ok) throw new Error("Failed to fetch posts")
            return res.json()
        },
        enabled: status === "authenticated",
    })

    // Initialize profile form
    useEffect(() => {
        if (userData) {
            setProfileName(userData.name || "")
            setProfileImage(userData.image || "")
        }
    }, [userData])

    // Update profile mutation
    const updateProfile = useMutation({
        mutationFn: async (data: { name: string; image: string }) => {
            const res = await fetch("/api/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error("Failed to update profile")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] })
        },
    })

    // Delete post mutation
    const deletePost = useMutation({
        mutationFn: async (slug: string) => {
            const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete post")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me-posts"] })
            queryClient.invalidateQueries({ queryKey: ["me-stats"] })
        },
    })

    // Delete account mutation
    const deleteAccount = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/me", { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete account")
            return res.json()
        },
        onSuccess: () => {
            signOut({ callbackUrl: "/" })
        },
    })

    // Avatar upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingAvatar(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "devloom_uploads")

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (data.secure_url) {
                const optimizedUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_200,h_200,c_fill/")
                setProfileImage(optimizedUrl)
            }
        } catch (error) {
            console.error("Avatar upload failed", error)
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    if (status === "loading") {
        return (
            <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        )
    }

    if (!session) return null

    const sidebarItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: "posts", label: "My Posts", icon: <FileText className="h-4 w-4" /> },
        { id: "settings", label: "Settings", icon: <User className="h-4 w-4" /> },
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
                    {/* User info */}
                    <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-muted/50 border border-border/50">
                        <Avatar className="h-11 w-11 border-2 border-primary/30 shadow-md">
                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                {session.user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{session.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
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
                            className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/dashboard/write">
                                <PenSquare className="mr-3 h-4 w-4" />
                                Write New Post
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
                        <OverviewTab stats={stats} statsLoading={statsLoading} posts={posts} user={session.user} />
                    )}
                    {activeTab === "posts" && (
                        <PostsTab
                            posts={posts}
                            postsLoading={postsLoading}
                            onDelete={(slug) => deletePost.mutate(slug)}
                            isDeleting={deletePost.isPending}
                        />
                    )}
                    {activeTab === "settings" && (
                        <SettingsTab
                            profileName={profileName}
                            setProfileName={setProfileName}
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            isUploadingAvatar={isUploadingAvatar}
                            handleAvatarUpload={handleAvatarUpload}
                            onSave={() => updateProfile.mutate({ name: profileName, image: profileImage })}
                            isSaving={updateProfile.isPending}
                            isSuccess={updateProfile.isSuccess}
                            userData={userData}
                            onDeleteAccount={() => deleteAccount.mutate()}
                            isDeletingAccount={deleteAccount.isPending}
                        />
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
    posts,
    user,
}: {
    stats?: UserStats
    statsLoading: boolean
    posts: UserPost[]
    user: any
}) {
    const statCards = [
        {
            label: "Total Posts",
            value: stats?.totalPosts ?? 0,
            icon: <FileText className="h-5 w-5" />,
            color: "from-blue-500/20 to-blue-600/5",
            iconColor: "text-blue-400",
            border: "border-blue-500/20",
        },
        {
            label: "Total Likes",
            value: stats?.totalLikes ?? 0,
            icon: <Heart className="h-5 w-5" />,
            color: "from-rose-500/20 to-rose-600/5",
            iconColor: "text-rose-400",
            border: "border-rose-500/20",
        },
        {
            label: "Comments Received",
            value: stats?.totalComments ?? 0,
            icon: <MessageSquare className="h-5 w-5" />,
            color: "from-emerald-500/20 to-emerald-600/5",
            iconColor: "text-emerald-400",
            border: "border-emerald-500/20",
        },
        {
            label: "Post Saves",
            value: stats?.totalSaved ?? 0,
            icon: <Bookmark className="h-5 w-5" />,
            color: "from-amber-500/20 to-amber-600/5",
            iconColor: "text-amber-400",
            border: "border-amber-500/20",
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Welcome back, <span className="text-primary">{user?.name?.split(" ")[0] || "User"}</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Here&apos;s an overview of your account activity.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`relative overflow-hidden rounded-xl border ${stat.border} bg-gradient-to-br ${stat.color} p-4 sm:p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
                    >
                        <div className={`${stat.iconColor} mb-3 opacity-80`}>{stat.icon}</div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                            {statsLoading ? (
                                <span className="inline-block h-8 w-12 bg-muted rounded animate-pulse" />
                            ) : (
                                stat.value
                            )}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent posts */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Recent Posts
                    </h2>
                    {posts.length > 3 && (
                        <button className="text-sm text-primary hover:underline font-medium">View All</button>
                    )}
                </div>
                {posts.length === 0 ? (
                    <div className="text-center py-16 rounded-xl border border-dashed border-border bg-muted/20">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">No posts yet</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">Start writing to see your posts here.</p>
                        <Button asChild className="mt-4">
                            <Link href="/dashboard/write">
                                <PenSquare className="mr-2 h-4 w-4" />
                                Write Your First Post
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.slice(0, 3).map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors group"
                            >
                                {/* Thumbnail */}
                                <div className="hidden sm:block w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border">
                                    {post.coverImage ? (
                                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/blogs/${post.slug}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </Link>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                        <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-3 w-3" /> {post._count.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" /> {post._count.comments}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/blogs/${post.slug}`}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ==========================
   POSTS TAB
   ========================== */
function PostsTab({
    posts,
    postsLoading,
    onDelete,
    isDeleting,
}: {
    posts: UserPost[]
    postsLoading: boolean
    onDelete: (slug: string) => void
    isDeleting: boolean
}) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My Posts</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage, edit, or delete your published posts.</p>
                </div>
                <Button asChild className="shadow-lg shadow-primary/20">
                    <Link href="/dashboard/write">
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">New Post</span>
                    </Link>
                </Button>
            </div>

            {postsLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 rounded-xl border border-dashed border-border bg-muted/20">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">No posts yet</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">Your published posts will appear here.</p>
                    <Button asChild>
                        <Link href="/dashboard/write">
                            <PenSquare className="mr-2 h-4 w-4" />
                            Write Your First Post
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card/50 hover:bg-card transition-all group"
                        >
                            {/* Thumbnail */}
                            <div className="hidden sm:block w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                                {post.coverImage ? (
                                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Post info */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/blogs/${post.slug}`}
                                    className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 text-base"
                                >
                                    {post.title}
                                </Link>

                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    {post.tags.slice(0, 3).map((t) => (
                                        <Badge
                                            key={t.tag.id}
                                            variant="secondary"
                                            className="bg-secondary/50 text-xs px-2 py-0"
                                        >
                                            {t.tag.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3 text-rose-400" /> {post._count.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3 text-emerald-400" /> {post._count.comments}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bookmark className="h-3 w-3 text-amber-400" /> {post._count.savedBy}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 sm:gap-1 shrink-0">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    title="Edit post"
                                >
                                    <Link href={`/dashboard/edit/${post.slug}`}>
                                        <PenSquare className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            title="Delete post"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete <strong>&quot;{post.title}&quot;</strong> and all its comments, likes, and saves. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(post.slug)}
                                                disabled={isDeleting}
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                                    title="View post"
                                >
                                    <Link href={`/blogs/${post.slug}`} target="_blank">
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ==========================
   SETTINGS TAB
   ========================== */
function SettingsTab({
    profileName,
    setProfileName,
    profileImage,
    setProfileImage,
    isUploadingAvatar,
    handleAvatarUpload,
    onSave,
    isSaving,
    isSuccess,
    userData,
    onDeleteAccount,
    isDeletingAccount,
}: {
    profileName: string
    setProfileName: (val: string) => void
    profileImage: string
    setProfileImage: (val: string) => void
    isUploadingAvatar: boolean
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
    isSaving: boolean
    isSuccess: boolean
    userData?: UserData
    onDeleteAccount: () => void
    isDeletingAccount: boolean
}) {
    return (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
                <p className="text-muted-foreground mt-1 text-sm">Update your profile information and manage your account.</p>
            </div>

            {/* Profile Section */}
            <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Profile Information
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <Avatar className="h-20 w-20 border-2 border-border shadow-lg">
                                <AvatarImage src={profileImage} alt="profile" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                    {profileName?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploadingAvatar}
                                />
                                {isUploadingAvatar ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-white" />
                                )}
                            </label>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">{profileName || "Your Name"}</p>
                            <p className="text-sm text-muted-foreground">{userData?.email}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Hover over avatar to change photo
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Display Name</label>
                        <Input
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Your display name"
                            className="bg-background"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Profile Image URL</label>
                        <Input
                            value={profileImage}
                            onChange={(e) => setProfileImage(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="bg-background font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">
                            You can also upload an image by hovering over your avatar above.
                        </p>
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <Input
                            value={userData?.email || ""}
                            disabled
                            className="bg-muted/50 text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email is linked to your sign-in provider and cannot be changed.
                        </p>
                    </div>

                    {/* Member since */}
                    {userData?.createdAt && (
                        <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                            Member since {format(new Date(userData.createdAt), "MMMM d, yyyy")}
                        </div>
                    )}

                    {/* Save button */}
                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto shadow-lg shadow-primary/20"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : isSuccess ? (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                Saved Successfully!
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-destructive/20">
                    <h2 className="font-semibold text-destructive">Danger Zone</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, all your posts, comments, and data will be permanently removed. This action cannot be undone.
                    </p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete your account and all associated data including posts, comments, likes, and saved posts. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onDeleteAccount}
                                    disabled={isDeletingAccount}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {isDeletingAccount ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Delete My Account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    )
}
