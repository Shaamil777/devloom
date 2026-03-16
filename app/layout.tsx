import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { QueryProvider } from "@/components/providers/QueryProvider";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devloom.vercel.app';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        template: "%s | DevLoom",
        default: "DevLoom | The Modern Developer Platform",
    },
    description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem. Join DevLoom today.",
    keywords: ["developer", "programming", "technology", "nextjs", "react", "tutorials", "software engineering", "coding blog"],
    authors: [{ name: "DevLoom Team" }],
    creator: "DevLoom",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: baseUrl,
        title: "DevLoom | The Modern Developer Platform",
        description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem.",
        siteName: "DevLoom",
        images: [
            {
                url: "/og-image.png", // We should ensure this exists or use a placeholder
                width: 1200,
                height: 630,
                alt: "DevLoom Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DevLoom | The Modern Developer Platform",
        description: "Discover the latest insights, tutorials, and discussions in the modern developer ecosystem.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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
