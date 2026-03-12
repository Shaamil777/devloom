import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { QueryProvider } from "@/components/providers/QueryProvider";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: {
        template: "%s | DevLoom",
        default: "DevLoom | The Modern Developer Platform",
    },
    description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem. Join DevLoom today.",
    keywords: ["developer", "programming", "technology", "nextjs", "react", "tutorials", "software engineering"],
    authors: [{ name: "DevLoom Team" }],
    creator: "DevLoom",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://devloom.vercel.app",
        title: "DevLoom | The Modern Developer Platform",
        description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem.",
        siteName: "DevLoom",
    },
    twitter: {
        card: "summary_large_image",
        title: "DevLoom | The Modern Developer Platform",
        description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem.",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={cn("dark font-sans", geist.variable)}>
            <body className="antialiased flex flex-col min-h-screen">
                <QueryProvider>
                    <AuthProvider>

                        <Navbar />
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
