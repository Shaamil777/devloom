import prisma from "@/lib/prisma"
import { PostCard } from "@/components/PostCard"
import Link from "next/link"
import { Search } from "lucide-react"

export const metadata = {
    title: 'Search | DevLoom',
    description: 'Search for articles, tutorials, and insights.',
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ""

    let posts: any[] = []

    if (query) {
        posts = await prisma.post.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ]
            },
            orderBy: { createdAt: "desc" },
            include: {
                author: true,
                tags: { include: { tag: true } },
                _count: {
                    select: { comments: true }
                }
            }
        })
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                    Search Results
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    {query ? `Showing results for "${query}"` : "Enter a search term to find articles."}
                </p>
            </div>

            {query && posts.length === 0 ? (
                <div className="text-center py-20 px-4 border border-dashed border-border rounded-3xl bg-card/50 shadow-sm flex flex-col items-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">No articles found</h2>
                    <p className="text-muted-foreground">
                        We couldn't find any articles matching "{query}".
                    </p>
                    <Link href="/blogs" className="mt-6 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-full transition-colors">
                        Explore all blogs
                    </Link>
                </div>
            ) : query ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} compact />
                    ))}
                </div>
            ) : null}
        </main>
    )
}
