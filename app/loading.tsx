export default function HomeLoading() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 w-full bg-background min-h-screen animate-pulse">

            {/* Hero Banner Skeleton */}
            <div className="w-full h-[200px] md:h-[260px] rounded-3xl bg-muted/50 mb-10" />

            <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

                {/* Main Feed Column */}
                <div className="flex-1 min-w-0">
                    <div className="mb-14 border-b border-border/50 pb-14">

                        {/* Section Title */}
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-2 h-2 rounded-full bg-muted" />
                            <div className="h-3 w-28 bg-muted rounded" />
                        </div>

                        {/* Featured Post Skeleton */}
                        <div className="w-full h-[280px] md:h-[340px] rounded-2xl bg-muted/40 border border-border/30 mb-6" />

                        {/* Grid Posts Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-2xl border border-border/30 bg-card/50 overflow-hidden">
                                    <div className="h-[160px] bg-muted/40" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 w-3/4 bg-muted/50 rounded" />
                                        <div className="h-3 w-full bg-muted/30 rounded" />
                                        <div className="h-3 w-2/3 bg-muted/30 rounded" />
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="h-7 w-7 rounded-full bg-muted/50" />
                                            <div className="h-3 w-20 bg-muted/40 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
                    <div className="rounded-2xl border border-border/30 bg-card/50 p-6 space-y-4">
                        <div className="h-5 w-40 bg-muted/50 rounded" />
                        <div className="h-px bg-border/30" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-7 w-24 bg-muted/40 rounded-full" />
                                <div className="h-3 w-8 bg-muted/30 rounded" />
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    )
}
