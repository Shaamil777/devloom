import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="flex max-w-7xl mx-auto">
                {/* Sidebar skeleton */}
                <aside className="hidden lg:flex w-64 shrink-0 border-r border-border flex-col p-5 h-[calc(100vh-4rem)]">
                    <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-muted/50 border border-border/50">
                        <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                </aside>

                {/* Main content skeleton */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="space-y-2 mb-8">
                        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-96 bg-muted/50 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-xl bg-muted/50 animate-pulse border border-border/50" />
                        ))}
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse border border-border/50" />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
