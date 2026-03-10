import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bookmark, Share2, Heart, MessageSquare } from "lucide-react";
import { Comments } from "@/components/Comments";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
        where: { slug: resolvedParams.slug },
    });

    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | DevLoom`,
        description: post.content.replace(/<[^>]+>/g, "").slice(0, 160),
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const resolvedParams = await params;

    // Fetch the post from DB along with author and tags
    const post = await prisma.post.findUnique({
        where: { slug: resolvedParams.slug },
        include: {
            author: true,
            tags: {
                include: { tag: true },
            },
            _count: {
                select: { comments: true }
            }
        },
    });

    // Handle missing or unpublished posts
    if (!post || !post.published) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen">
            <article className="w-full">
                {/* Header section */}
                <header className="mb-10 flex flex-col items-center text-center">

                    {/* Back Button */}
                    <div className="w-full flex justify-start mb-6 -ml-2">
                        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium group px-2 py-1 bg-transparent rounded-md">
                            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
                        </Link>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {post.tags.map((tagObj) => (
                                <Link key={tagObj.tag.id} href={`/tags/${tagObj.tag.slug}`}>
                                    <Badge variant="secondary" className="bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-transform hover:-translate-y-0.5 uppercase tracking-widest text-xs px-4 py-1.5 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] font-bold cursor-pointer">
                                        {tagObj.tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-tight max-w-3xl">
                        {post.title}
                    </h1>

                    {/* Meta info row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground w-full">
                        <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 group">
                            <Avatar className="h-11 w-11 border border-border shadow-sm group-hover:border-primary transition-colors">
                                <AvatarImage src={post.author.image || ""} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                                    {post.author.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
                                    {post.author.name}
                                </span>
                            </div>
                        </Link>

                        <div className="h-8 w-px bg-border flex-shrink-0 hidden sm:block mx-2"></div>

                        <div className="flex flex-col items-start text-xs font-medium hidden sm:flex">
                            <span className="text-muted-foreground/80 uppercase tracking-widest text-[10px]">Published</span>
                            <span className="text-foreground text-sm">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 border border-border shadow-2xl shadow-primary/5 relative">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Sticky Action Sidebar (Desktop) / Floating Action Bar (Mobile) & Content */}
                <div className="relative flex flex-col md:flex-row gap-8 xl:gap-14">

                    {/* Left Sticky Actions */}
                    <aside className="hidden md:flex flex-col gap-5 sticky top-32 h-fit shrink-0 mt-2">
                        <button className="h-11 w-11 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-primary hover:border-primary/50 group shadow-sm hover:shadow-md">
                            <Heart className="h-5 w-5 group-hover:fill-primary/20" />
                        </button>
                        <a href="#comments" className="h-11 w-11 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 group shadow-sm hover:shadow-md relative">
                            <MessageSquare className="h-5 w-5 group-hover:fill-blue-500/20" />
                            {post._count.comments > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                                    {post._count.comments}
                                </span>
                            )}
                        </a>
                        <button className="h-11 w-11 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-green-500 hover:border-green-500/50 group shadow-sm hover:shadow-md">
                            <Bookmark className="h-5 w-5 group-hover:fill-green-500/20" />
                        </button>
                        <div className="h-px w-6 bg-border mx-auto my-1"></div>
                        <button className="h-11 w-11 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-secondary hover:border-secondary/50 group shadow-sm hover:shadow-md">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </aside>

                    {/* Content Area */}
                    <div
                        className="flex-1 w-full min-w-0 prose prose-lg md:prose-xl prose-invert max-w-none 
                        prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight 
                        prose-a:text-primary hover:prose-a:text-primary/80 
                        prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-md
                        prose-hr:border-border/50 
                        prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-medium prose-blockquote:italic
                        prose-pre:bg-[#0B0E14] prose-pre:border prose-pre:border-border prose-pre:shadow-xl prose-pre:rounded-xl
                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Mobile Action Bar */}
                <div className="md:hidden flex items-center justify-center gap-6 mt-12 py-6 border-t border-border">
                    <button className="h-12 w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-primary hover:border-primary/50 group shadow-sm hover:shadow-md">
                        <Heart className="h-5 w-5 group-hover:fill-primary/20" />
                    </button>
                    <a href="#comments" className="h-12 w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 group shadow-sm hover:shadow-md relative">
                        <MessageSquare className="h-5 w-5 group-hover:fill-blue-500/20" />
                        {post._count.comments > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                                {post._count.comments}
                            </span>
                        )}
                    </a>
                    <button className="h-12 w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-green-500 hover:border-green-500/50 group shadow-sm hover:shadow-md">
                        <Bookmark className="h-5 w-5 group-hover:fill-green-500/20" />
                    </button>
                    <button className="h-12 w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-secondary hover:border-secondary/50 group shadow-sm hover:shadow-md">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>

                {/* Comments Section */}
                <Comments postSlug={resolvedParams.slug} />

            </article>
        </main>
    );
}
