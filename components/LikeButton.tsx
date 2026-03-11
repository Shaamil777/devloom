"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function LikeButton({ postSlug }: { postSlug: string }) {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isAnimating, setIsAnimating] = useState(false)

    const { data: likeData = { totalLikes: 0, hasLiked: false } } = useQuery({
        queryKey: ['likes', postSlug],
        queryFn: async () => {
            const res = await fetch(`/api/posts/${postSlug}/like`)
            if (!res.ok) throw new Error("Failed to fetch likes")
            return res.json()
        }
    })

    const toggleLike = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${postSlug}/like`, { method: 'POST' })
            if (!res.ok) throw new Error("Failed to toggle like")
            return res.json()
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['likes', postSlug] })

            const previousData = queryClient.getQueryData(['likes', postSlug]) as { totalLikes: number, hasLiked: boolean }

            queryClient.setQueryData(['likes', postSlug], {
                ...previousData,
                hasLiked: !previousData.hasLiked,
                totalLikes: previousData.hasLiked ? previousData.totalLikes - 1 : previousData.totalLikes + 1
            })

            return { previousData }
        },
        onError: (err, newLike, context) => {
            queryClient.setQueryData(['likes', postSlug], context?.previousData)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['likes', postSlug] })
        }
    })

    const handleLikeClick = () => {
        if (!session) {
            router.push('/login')
            return
        }
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
        toggleLike.mutate()
    }

    return (
        <button
            onClick={handleLikeClick}
            className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-primary hover:border-primary/50 group shadow-sm hover:shadow-md relative"
        >
            <Heart
                className={`h-5 w-5 transition-transform duration-300 ${likeData.hasLiked ? 'fill-primary text-primary' : 'group-hover:fill-primary/20'} ${isAnimating ? 'scale-125' : 'scale-100'}`}
            />
            {likeData.totalLikes > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                    {likeData.totalLikes}
                </span>
            )}
        </button>
    )
}
