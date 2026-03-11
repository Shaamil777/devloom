export default function WriteLoading() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] flex flex-col animate-pulse">

            {/* Top Nav / Progress */}
            <div className="flex items-center justify-between mb-12">
                <div className="h-9 w-28 bg-muted/40 rounded-lg" />
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-muted/30 rounded" />
                    <div className="h-4 w-4 bg-muted/20 rounded" />
                    <div className="h-4 w-24 bg-muted/30 rounded" />
                </div>
                <div className="h-9 w-28 bg-muted/40 rounded-lg" />
            </div>

            {/* Step Title */}
            <div className="space-y-2 mb-8">
                <div className="h-8 w-56 bg-muted/50 rounded-lg" />
                <div className="h-4 w-80 bg-muted/30 rounded" />
            </div>

            {/* Cover Image Area */}
            <div className="rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/20 aspect-video max-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted/30" />
                    <div className="h-3 w-32 bg-muted/30 rounded" />
                </div>
            </div>

            {/* Title Input */}
            <div className="mt-8">
                <div className="h-12 w-3/4 bg-muted/40 rounded-lg" />
            </div>
        </div>
    )
}
