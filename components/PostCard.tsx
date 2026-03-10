import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        coverImage: string | null;
        createdAt: string | Date;
        author: {
            name: string | null;
            image: string | null;
        };
        tags: {
            tag: {
                id: string;
                name: string;
                slug: string;
            };
        }[];
    };
    compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
    const excerptLength = compact ? 80 : 120;
    const plainTextExcerpt = post.content.replace(/<[^>]+>/g, "").slice(0, excerptLength) + "...";

    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 bg-card border-border h-full">
            <Link href={`/blogs/${post.slug}`} className={`block relative overflow-hidden group ${compact ? 'aspect-[16/9] max-h-[160px]' : 'aspect-video'}`}>
                {post.coverImage ? (
                    <>
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-card to-background flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        <span className="text-muted-foreground font-medium text-lg">DevLoom Article</span>
                    </div>
                )}
            </Link>

            <div className={`flex flex-col flex-1 ${compact ? 'p-4' : 'p-5'}`}>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {post.tags.slice(0, 3).map((tagObj) => (
                        <Badge key={tagObj.tag.id} variant="secondary" className="bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-colors uppercase tracking-widest text-[10px] shadow-sm font-bold">
                            {tagObj.tag.name}
                        </Badge>
                    ))}
                </div>

                <Link href={`/blogs/${post.slug}`} className="group-hover:underline">
                    <h3 className={`font-bold tracking-tight mb-1.5 text-foreground line-clamp-2 ${compact ? 'text-base' : 'text-xl'}`}>
                        {post.title}
                    </h3>
                </Link>
                <p className={`text-muted-foreground line-clamp-2 flex-1 ${compact ? 'text-xs mb-3' : 'text-sm mb-4 line-clamp-3'}`}>
                    {plainTextExcerpt}
                </p>

                <div className={`flex items-center gap-2.5 mt-auto border-t border-border/50 ${compact ? 'pt-3' : 'pt-4'}`}>
                    <Avatar className={`border border-border ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}>
                        <AvatarImage src={post.author.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {post.author.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className={`font-medium leading-none text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{post.author.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
