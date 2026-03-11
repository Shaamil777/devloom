"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCcw, Home, AlertTriangle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Page error:", error)
    }, [error])

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-red-500/[0.04] rounded-full blur-3xl" />
                <div className="absolute bottom-[15%] left-[15%] w-[350px] h-[350px] bg-orange-500/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">

                <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                <p className="text-[11px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase mb-4">
                    Something went wrong
                </p>

                <div className="h-1 w-12 bg-red-500/40 rounded-full mb-8" />

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                    Unexpected Error
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-10">
                    Something broke while loading this page. This is usually temporary — try again and it might just work.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-card border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
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
