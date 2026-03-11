export default function SavedLoading() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-background min-h-screen animate-pulse">

            <div className="flex items-center gap-3 mb-10 border-b border-border/50 pb-8">
                <div className="p-3 bg-muted/30 rounded-xl">
                    <div className="h-6 w-6 bg-muted/50 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-7 w-44 bg-muted/50 rounded-lg" />
                    <div className="h-3 w-64 bg-muted/30 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </main>
    )
}
