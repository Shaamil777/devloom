import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FeaturedPostCard({ post }: { post: any }) {
    return (
        <Link href={`/blogs/${post.slug}`} className="group relative block w-full h-[400px] md:h-full min-h-[400px] rounded-2xl overflow-hidden border border-border mt-3 mb-6 lg:mb-0">
            {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-[#1e2532] flex items-center justify-center transition-transform duration-700 group-hover:scale-105 border-4 border-[#161B22]">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#A855F7 1px, transparent 1px), linear-gradient(90deg, #A855F7 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/70 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white flex flex-col gap-3">
                {post.tags?.[0] && (
                    <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-1 uppercase tracking-wider">
                        {post.tags[0].tag.name}
                    </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold line-clamp-3 leading-tight tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                    {post.title}
                </h3>
                <p className="text-gray-300 line-clamp-2 text-sm md:text-base max-w-2xl font-medium mb-1">
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                </p>

                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white/20 shadow-sm">
                        <AvatarImage src={post.author?.image || ""} />
                        <AvatarFallback className="bg-primary text-white text-xs">
                            {post.author?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center text-sm gap-2 font-medium">
                        <span className="text-white hover:underline">{post.author?.name || "Unknown Writer"}</span>
                        <span className="text-gray-500">&bull;</span>
                        <span className="text-gray-300">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                        <span className="text-gray-500 hidden sm:inline">&bull;</span>
                        <span className="text-gray-300 hidden sm:inline">5 min read</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
