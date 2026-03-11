import prisma from "@/lib/prisma"
import { PostCard } from "@/components/PostCard"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export const metadata = {
    title: 'Explore Articles | DevLoom',
    description: 'Explore all articles, tutorials, and insights filtered by topic.',
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const tagSlug = typeof resolvedParams.tag === 'string' ? resolvedParams.tag : undefined
    const currentPage = typeof resolvedParams.page === 'string' ? Math.max(1, parseInt(resolvedParams.page) || 1) : 1
    const ITEMS_PER_PAGE = 12

    // Fetch all available tags for the filter
    const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' }
    })

    const whereClause = {
        published: true,
        ...(tagSlug ? {
            tags: {
                some: {
                    tag: { slug: tagSlug }
                }
            }
        } : {})
    }

    // Count total posts for pagination
    const totalPosts = await prisma.post.count({ where: whereClause })
    const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE)

    // Fetch posts, optionally filtering by specific tag slug
    const posts = await prisma.post.findMany({
        where: whereClause,
        take: ITEMS_PER_PAGE,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            tags: { include: { tag: true } },
            _count: {
                select: { comments: true }
            }
        }
    })

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                    Explore Articles
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Dive into our collection of tutorials, stories, and technical insights.
                </p>
            </div>

            {/* Tag Filter Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16 pb-8 border-b border-border/50">
                <Link href="/blogs" scroll={false}>
                    <Badge
                        variant={!tagSlug ? "default" : "outline"}
                        className={`text-sm px-5 py-2 cursor-pointer transition-all ${!tagSlug ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                    >
                        All Posts
                    </Badge>
                </Link>
                {tags.map(tag => (
                    <Link key={tag.id} href={`/blogs?tag=${tag.slug}`} scroll={false}>
                        <Badge
                            variant={tagSlug === tag.slug ? "default" : "outline"}
                            className={`text-sm px-5 py-2 cursor-pointer transition-all ${tagSlug === tag.slug ? 'bg-[#F97316] text-white hover:bg-[#F97316]/90 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] border-transparent' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                        >
                            {tag.name}
                        </Badge>
                    </Link>
                ))}
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 px-4 border border-dashed border-border rounded-3xl bg-card/50 shadow-sm flex flex-col items-center">
                    <h2 className="text-xl font-bold text-foreground mb-2">No articles found</h2>
                    <p className="text-muted-foreground">
                        {tagSlug ? `We couldn't find any articles tagged with "${tags.find(t => t.slug === tagSlug)?.name || tagSlug}".` : "There are no published articles yet."}
                    </p>
                    {tagSlug && (
                        <Link href="/blogs" className="mt-6 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-full transition-colors">
                            Clear filters
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} compact />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination className="mt-8 pb-12">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href={currentPage > 1 ? `/blogs?${new URLSearchParams({
                                            ...(tagSlug ? { tag: tagSlug } : {}),
                                            page: (currentPage - 1).toString()
                                        }).toString()}` : '#'} 
                                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                                
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    // Show first, last, current, and adjacent pages
                                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    isActive={page === currentPage}
                                                    href={`/blogs?${new URLSearchParams({
                                                        ...(tagSlug ? { tag: tagSlug } : {}),
                                                        page: page.toString()
                                                    }).toString()}`}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    }
                                    
                                    // Render ellipses where there are gaps
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }

                                    return null;
                                })}

                                <PaginationItem>
                                    <PaginationNext 
                                        href={currentPage < totalPages ? `/blogs?${new URLSearchParams({
                                            ...(tagSlug ? { tag: tagSlug } : {}),
                                            page: (currentPage + 1).toString()
                                        }).toString()}` : '#'}
                                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </main>
    )
}
