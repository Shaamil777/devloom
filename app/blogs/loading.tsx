export default function BlogsLoading() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen animate-pulse">

            <div className="flex flex-col items-center text-center mb-12">
                <div className="h-10 w-64 bg-muted/50 rounded-lg mb-4" />
                <div className="h-4 w-96 max-w-full bg-muted/30 rounded" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-16 pb-8 border-b border-border/50">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-9 rounded-full bg-muted/40" style={{ width: `${60 + i * 12}px` }} />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/30 bg-card/50 overflow-hidden">
                        <div className="h-[150px] bg-muted/40" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 w-3/4 bg-muted/50 rounded" />
                            <div className="h-3 w-full bg-muted/30 rounded" />
                            <div className="h-3 w-1/2 bg-muted/30 rounded" />
                            <div className="flex items-center gap-2 pt-2">
                                <div className="h-6 w-6 rounded-full bg-muted/50" />
                                <div className="h-3 w-16 bg-muted/40 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
