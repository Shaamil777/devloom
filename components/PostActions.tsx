"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"

interface PostActionsProps {
    postSlug: string
    authorId: string
}

export function PostActions({ postSlug, authorId }: PostActionsProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    if (!session?.user?.email) return null


    return (
        <UserActions
            postSlug={postSlug}
            authorId={authorId}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            deleting={deleting}
            setDeleting={setDeleting}
            router={router}
        />
    )
}

function UserActions({
    postSlug,
    authorId,
    showConfirm,
    setShowConfirm,
    deleting,
    setDeleting,
    router,
}: {
    postSlug: string
    authorId: string
    showConfirm: boolean
    setShowConfirm: (v: boolean) => void
    deleting: boolean
    setDeleting: (v: boolean) => void
    router: ReturnType<typeof useRouter>
}) {
    const { data: session } = useSession()

    const [isOwner, setIsOwner] = useState<boolean | null>(null)

    useEffect(() => {
        fetch("/api/me")
            .then(res => res.json())
            .then(user => {
                setIsOwner(user?.id === authorId)
            })
            .catch(() => setIsOwner(false))
    })

    if (!isOwner) return null

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/posts/${postSlug}`, {
                method: "DELETE",
            })
            if (res.ok) {
                router.push("/blogs")
                router.refresh()
            } else {
                alert("Failed to delete post")
            }
        } catch {
            alert("Something went wrong")
        } finally {
            setDeleting(false)
            setShowConfirm(false)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => router.push(`/dashboard/edit/${postSlug}`)}
                    className="h-11 w-11 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 group shadow-sm hover:shadow-md cursor-pointer"
                    title="Edit post"
                >
                    <Pencil className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={() => setShowConfirm(true)}
                    className="h-11 w-11 rounded-full bg-card hover:bg-red-500/10 border border-border flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-red-500 hover:border-red-500/50 group shadow-sm hover:shadow-md cursor-pointer"
                    title="Delete post"
                >
                    <Trash2 className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowConfirm(false)}
                    />

                    <div className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                                <Trash2 className="h-6 w-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                Delete this post?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                This action cannot be undone. The post and all its comments will be permanently removed.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-muted text-foreground font-semibold text-sm rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
