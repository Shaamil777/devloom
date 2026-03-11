"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import TiptapEditor from "@/components/TiptapEditor"

export default function EditPostPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch the existing post data
    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${slug}`)
                if (!res.ok) {
                    setError("Post not found or you don't have permission to edit it.")
                    setLoading(false)
                    return
                }
                const post = await res.json()

                // Verify ownership
                const meRes = await fetch("/api/me")
                const me = await meRes.json()

                if (post.authorId !== me?.id) {
                    setError("You don't have permission to edit this post.")
                    setLoading(false)
                    return
                }

                setTitle(post.title)
                setCoverImage(post.coverImage || "")
                setContent(post.content)
                setLoading(false)
            } catch {
                setError("Failed to load post.")
                setLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    // Update mutation
    const updatePost = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, coverImage: coverImage || null }),
            })
            if (!res.ok) throw new Error("Failed to update post")
            return res.json()
        },
        onSuccess: () => {
            router.push(`/blogs/${slug}`)
            router.refresh()
        },
    })

    // Loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 text-lg font-semibold">{error}</p>
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] flex flex-col">

            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-10">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                </Button>

                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="text-primary">Editing Post</span>
                </div>

                <Button
                    onClick={() => updatePost.mutate()}
                    disabled={updatePost.isPending || !title.trim() || content.length < 20}
                    className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                >
                    {updatePost.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Save Changes <Check className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* Title */}
            <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Edit your post</h2>
                <p className="text-muted-foreground text-sm">Update the title, cover image, or content below.</p>
            </div>

            {/* Cover Image */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">Cover Image URL</label>
                <Input
                    placeholder="https://images.unsplash.com/..."
                    className="bg-background border-border"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                />
                {coverImage && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-border aspect-video max-h-[250px]">
                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {/* Title Input */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">Title</label>
                <input
                    type="text"
                    placeholder="Your post title here..."
                    className="w-full text-3xl md:text-4xl font-extrabold bg-transparent outline-none placeholder:text-muted-foreground/30 text-foreground tracking-tight leading-tight"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Content Editor */}
            <div className="flex-1 mb-20">
                <label className="text-sm font-semibold text-foreground mb-2 block">Content</label>
                <TiptapEditor content={content} onChange={setContent} />
            </div>

            {/* Error Display */}
            {updatePost.isError && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                    Failed to save changes. Please try again.
                </div>
            )}
        </div>
    )
}
