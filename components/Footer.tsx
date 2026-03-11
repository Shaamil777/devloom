import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Heart, Rss } from "lucide-react"

const footerLinks = {
    explore: [
        { label: "Home", href: "/" },
        { label: "Blogs", href: "/blogs" },
        { label: "Saved Articles", href: "/saved" },
    ],
    create: [
        { label: "Write a Post", href: "/dashboard/write" },
        { label: "Dashboard", href: "/dashboard" },
    ],
}

const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@devloom.com", label: "Email" },
]

export default function Footer() {
    return (
        <footer className="relative border-t border-border bg-background overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    <div className="md:col-span-5 space-y-5">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-extrabold tracking-tight text-foreground">
                                Dev<span className="text-primary">Loom</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            A modern developer blogging platform. Share your knowledge,
                            explore insights, and connect with the dev community.
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/30 transition-all duration-300 group"
                                >
                                    <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-5">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1.5 group"
                                    >
                                        <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-5">
                            Create
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.create.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1.5 group"
                                    >
                                        <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-5">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Follow along for the latest posts and updates.
                        </p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
                        >
                            <Rss className="h-4 w-4" />
                            <span>Browse Articles</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                            &copy; {new Date().getFullYear()} DevLoom. Crafted with
                            <Heart className="h-3 w-3 text-red-500 fill-red-500 inline-block animate-pulse" />
                            for developers.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
                            <span className="hover:text-muted-foreground transition-colors cursor-pointer">Privacy</span>
                            <span className="hover:text-muted-foreground transition-colors cursor-pointer">Terms</span>
                            <span className="hover:text-muted-foreground transition-colors cursor-pointer">RSS</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
