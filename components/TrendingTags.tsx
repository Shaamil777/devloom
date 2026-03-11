import Link from "next/link";
import prisma from "@/lib/prisma";

export async function TrendingTags() {
    const tags = await prisma.tag.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        },
        orderBy: {
            posts: {
                _count: 'desc'
            }
        },
        take: 15
    });

    return (
        <div className="rounded-2xl border border-border bg-card p-6 sticky top-24 shadow-sm shadow-black/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-6 tracking-tight">
                <span className="text-blue-500 text-xl leading-none">#</span> Trending tags this week
            </h3>

            <div className="flex flex-col space-y-5">
                {tags.map((tag, index) => (
                    <Link href={`/tags/${tag.slug}`} key={tag.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className="text-muted-foreground font-semibold w-5 text-center text-sm">{index + 1}</span>
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">#{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <div className="w-5 h-5 rounded-full border border-card bg-slate-300"></div>
                                <div className="w-5 h-5 rounded-full border border-card bg-slate-400"></div>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">{tag._count.posts}</span>
                        </div>
                    </Link>
                ))}

                {tags.length === 0 && (
                    <p className="text-muted-foreground italic text-sm text-center py-4">No tags created yet.</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground/60 flex flex-wrap gap-x-3 gap-y-2">
                    <Link href="#" className="hover:underline">About</Link>
                    <Link href="#" className="hover:underline">Guidelines</Link>
                    <Link href="#" className="hover:underline">Privacy</Link>
                    <Link href="#" className="hover:underline">Terms</Link>
                </p>
                <p className="text-xs text-muted-foreground/40 mt-3">&copy; 2026 DevLoom</p>
            </div>
        </div>
    )
}
