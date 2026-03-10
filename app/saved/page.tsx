import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/PostCard"
import { Bookmark } from "lucide-react"

export const metadata = {
    title: 'Saved Articles | DevLoom',
    description: 'Your saved articles and bookmarks',
}

export default async function SavedPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        redirect("/login")
    }

    // Fetch saved posts for UI
    const savedPostsData = await prisma.savedPost.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                include: {
                    author: true,
                    tags: { include: { tag: true } }
                }
            }
        }
    })

    const posts = savedPostsData.map(save => save.post)

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen">
            <div className="flex items-center gap-3 mb-10 border-b border-border/50 pb-8">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <Bookmark className="h-6 w-6 text-green-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Saved Articles</h1>
                    <p className="text-muted-foreground mt-1">Ready for you whenever you want to read them.</p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 px-4 border border-dashed border-border rounded-3xl bg-card/50 shadow-sm flex flex-col items-center">
                    <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <Bookmark className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">You haven't saved any articles</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        When you find something interesting, click the bookmark icon on the post to seamlessly add it to your reading list.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </main>
    )
}
