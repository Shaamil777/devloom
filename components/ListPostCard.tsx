import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark } from "lucide-react";

export function ListPostCard({ post }: { post: any }) {
    const plainTextExcerpt = post.content.replace(/<[^>]+>/g, "").slice(0, 150) + "...";

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-8 py-8 border-b border-border/50 group">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.image || ""} />
                            <AvatarFallback className="bg-primary text-white text-[10px]">
                                {post.author?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{post.author?.name || "Unknown"}</span>
                        <span className="text-muted-foreground hidden sm:inline">in</span>
                        <span className="text-muted-foreground font-medium hidden sm:inline">DevLoom</span>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>

                <Link href={`/blogs/${post.slug}`} className="group-hover:underline decoration-border underline-offset-4 mb-2">
                    <h2 className="text-xl md:text-[22px] font-bold text-foreground leading-tight tracking-tight">
                        {post.title}
                    </h2>
                </Link>
                <Link href={`/blogs/${post.slug}`}>
                    <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed font-medium hidden sm:block">
                        {plainTextExcerpt}
                    </p>
                </Link>

                <div className="flex items-center text-xs text-muted-foreground gap-2 font-medium">
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                    <span className="hidden sm:inline">&bull;</span>
                    {post.tags?.[0] && (
                        <span className="bg-[#F97316] text-white font-bold px-3 py-1 text-[11px] rounded-full hidden sm:inline shadow-sm uppercase tracking-wider">{post.tags[0].tag.name}</span>
                    )}
                    <span>&bull;</span>
                    <span>6 min read</span>
                </div>
            </div>

            {post.coverImage ? (
                <Link href={`/blogs/${post.slug}`} className="block shrink-0 w-full md:w-[240px] aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-xl border border-border mt-2 md:mt-0 opacity-90 hover:opacity-100 transition-opacity">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
            ) : (
                <Link href={`/blogs/${post.slug}`} className="block shrink-0 w-full md:w-[240px] aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-xl border border-border mt-2 md:mt-0 bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#A855F7 1px, transparent 1px), linear-gradient(90deg, #A855F7 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                    <span className="text-muted-foreground font-mono opacity-30 text-4xl">{'</>'}</span>
                </Link>
            )}
        </div>
    );
}
