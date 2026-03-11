"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export function ShareButton({ title, slug }: { title: string, slug: string }) {
    const [isSharing, setIsSharing] = useState(false)

    const handleShare = async () => {
        setIsSharing(true)
        const shareData = {
            title: title,
            text: `Read "${title}" on DevLoom!`,
            url: `${window.location.origin}/blogs/${slug}`
        }

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(shareData.url)
                toast.success("Link copied to clipboard!")
            }
        } catch (error) {
            console.error("Error sharing:", error)
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <button
            onClick={handleShare}
            disabled={isSharing}
            className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-secondary hover:border-secondary/50 group shadow-sm hover:shadow-md"
        >
            <Share2 className="h-5 w-5" />
        </button>
    )
}
