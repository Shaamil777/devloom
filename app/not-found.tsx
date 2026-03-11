import Link from "next/link"
import { Home, Search } from "lucide-react"

export default function NotFound() {
    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-red-500/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-blue-500/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">

                <div className="mb-8">
                    <span className="inline-block text-8xl md:text-9xl font-black tracking-tighter text-foreground/[0.07] leading-none select-none">
                        404
                    </span>
                </div>

                <p className="text-[11px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase mb-4">
                    Page not found
                </p>

                <div className="h-1 w-12 bg-primary/40 rounded-full mb-8" />

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                    Oops! Lost in the code.
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-10">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                    Let&apos;s get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <Link
                        href="/blogs"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-card border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Search className="h-4 w-4" />
                        Browse Articles
                    </Link>
                </div>

                <p className="mt-14 text-xs text-muted-foreground/40">
                    Error 404 — DevLoom
                </p>
            </div>
        </main>
    )
}
