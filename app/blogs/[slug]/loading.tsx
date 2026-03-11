export default function BlogPostLoading() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen animate-pulse">
            <article className="w-full">

                {/* Header */}
                <header className="mb-10 flex flex-col items-center text-center">

                    {/* Back Button */}
                    <div className="w-full flex justify-start mb-6">
                        <div className="h-4 w-28 bg-muted/40 rounded" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-6">
                        <div className="h-7 w-20 bg-muted/40 rounded-full" />
                        <div className="h-7 w-24 bg-muted/40 rounded-full" />
                    </div>

                    {/* Title */}
                    <div className="space-y-3 w-full max-w-3xl mb-8">
                        <div className="h-10 w-full bg-muted/50 rounded-lg" />
                        <div className="h-10 w-3/4 bg-muted/50 rounded-lg mx-auto" />
                    </div>

                    {/* Author Meta */}
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-muted/50" />
                        <div className="space-y-1.5 text-left">
                            <div className="h-4 w-28 bg-muted/50 rounded" />
                        </div>
                        <div className="h-8 w-px bg-border/30 mx-2 hidden sm:block" />
                        <div className="space-y-1.5 hidden sm:block">
                            <div className="h-2 w-16 bg-muted/30 rounded" />
                            <div className="h-3 w-24 bg-muted/40 rounded" />
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] bg-muted/40 mb-12 border border-border/30" />

                {/* Content Skeleton */}
                <div className="flex flex-col md:flex-row gap-8 xl:gap-14">

                    {/* Side Actions */}
                    <aside className="hidden md:flex flex-col gap-5 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-11 w-11 rounded-full bg-muted/40" />
                        ))}
                    </aside>

                    {/* Content Lines */}
                    <div className="flex-1 space-y-5">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-muted/30 rounded"
                                style={{ width: `${65 + Math.random() * 35}%` }}
                            />
                        ))}
                        <div className="h-48 w-full bg-muted/20 rounded-2xl border border-border/20 my-4" />
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`b-${i}`}
                                className="h-4 bg-muted/30 rounded"
                                style={{ width: `${55 + Math.random() * 45}%` }}
                            />
                        ))}
                    </div>
                </div>
            </article>
        </main>
    )
}
