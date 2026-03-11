"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCcw, ArrowLeft, FileWarning } from "lucide-react"

export default function BlogPostError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Blog post error:", error)
    }, [error])

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 bg-background min-h-[calc(100vh-4rem)]">

            {/* Back Button */}
            <div className="mb-12">
                <Link
                    href="/blogs"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium group w-fit"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
            </div>

            <div className="flex flex-col items-center text-center max-w-lg mx-auto">

                {/* Icon */}
                <div className="mb-8 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                    <FileWarning className="h-10 w-10 text-orange-500" />
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
                    Couldn&apos;t load this article
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-10">
                    There was a problem loading this post. The server might be temporarily unavailable — give it another try.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>

                    <Link
                        href="/blogs"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-card border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Browse Other Articles
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-10 text-[10px] text-muted-foreground/30 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </main>
    )
}
