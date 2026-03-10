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
}

export function PostCard({ post }: PostCardProps) {
    // Extract a short excerpt from the content (strip HTML tags if any)
    const plainTextExcerpt = post.content.replace(/<[^>]+>/g, "").slice(0, 120) + "...";

    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 bg-card border-border h-full">
            <Link href={`/blogs/${post.slug}`} className="block relative aspect-video overflow-hidden group">
                {/* If there's an image, show it. Otherwise show a sleek gradient placeholder */}
                {post.coverImage ? (
                    <>
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* The Black Overlay to make text pop as requested */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-card to-background flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        <span className="text-muted-foreground font-medium text-lg">DevLoom Article</span>
                    </div>
                )}
            </Link>

            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {post.tags.slice(0, 3).map((tagObj) => (
                        <Badge key={tagObj.tag.id} variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors">
                            {tagObj.tag.name}
                        </Badge>
                    ))}
                </div>

                <Link href={`/blogs/${post.slug}`} className="group-hover:underline">
                    <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground line-clamp-2">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {plainTextExcerpt}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                    <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={post.author.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {post.author.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none text-foreground">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
