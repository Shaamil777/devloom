"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function BookmarkButton({ postSlug }: { postSlug: string }) {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isAnimating, setIsAnimating] = useState(false)

    // Fetch initial save status
    const { data: saveData = { hasSaved: false } } = useQuery({
        queryKey: ['saved', postSlug],
        queryFn: async () => {
            const res = await fetch(`/api/posts/${postSlug}/save`)
            if (!res.ok) throw new Error("Failed to fetch save status")
            return res.json()
        }
    })

    // Toggle Save Mutation
    const toggleSave = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${postSlug}/save`, { method: 'POST' })
            if (!res.ok) throw new Error("Failed to toggle save")
            return res.json()
        },
        onMutate: async () => {
            // Cancel outgoing to stop race conditions
            await queryClient.cancelQueries({ queryKey: ['saved', postSlug] })

            // Snapshot previous
            const previousData = queryClient.getQueryData(['saved', postSlug]) as { hasSaved: boolean }

            // Optimistic update
            queryClient.setQueryData(['saved', postSlug], { hasSaved: !previousData?.hasSaved })

            return { previousData }
        },
        onError: (err, newSave, context) => {
            queryClient.setQueryData(['saved', postSlug], context?.previousData)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['saved', postSlug] })
        }
    })

    const handleSaveClick = () => {
        if (!session) {
            router.push('/login')
            return
        }
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
        toggleSave.mutate()
    }

    return (
        <button
            onClick={handleSaveClick}
            className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-green-500 hover:border-green-500/50 group shadow-sm hover:shadow-md relative"
        >
            <Bookmark
                className={`h-5 w-5 transition-transform duration-300 ${saveData.hasSaved ? 'fill-green-500 text-green-500' : 'group-hover:fill-green-500/20'} ${isAnimating ? 'scale-125' : 'scale-100'}`}
            />
        </button>
    )
}
