import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroBanner() {
    return (
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-xl shadow-black/20">
            <div className="flex-1 space-y-6 relative z-10 p-8 md:p-14 w-full">
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1] max-w-2xl">
                    Built by Developers.<br />
                    <span className="text-muted-foreground">Written for Developers.</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl font-medium">
                    DevLoom is a space for engineers to publish technical insights, break down complex problems, and share the ideas behind the code.
                </p>
                <div className="pt-2">
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer">
                        <Link href="/dashboard/write">Start your blog</Link>
                    </Button>
                </div>
            </div>

            <div className="hidden lg:block relative w-[400px] h-[320px] mr-8 my-auto shrink-0 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-border/50 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 bg-card">
                    <Image
                        src="/Images/hashnode-hero-illustration-2.webp"
                        alt="Hero illustration"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
