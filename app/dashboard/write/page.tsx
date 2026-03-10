"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, X, ArrowLeft, ArrowRight, Check } from "lucide-react"
import TiptapEditor from "@/components/TiptapEditor"

export default function WritePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    // Form State
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [content, setContent] = useState("<p>Start writing your masterpiece...</p>")

    // Tags logic
    const [tags, setTags] = useState<string[]>([])

    const { data: availableTags = [] } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await fetch('/api/tags')
            if (!res.ok) throw new Error("Failed to fetch tags")
            return res.json()
        }
    })

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    // Dynamic slug preview
    const slugPreview = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // Publishing Mutation
    const createPost = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slugPreview || `post-${Date.now()}`,
                    content,
                    coverImage: coverImage || null,
                    tags
                })
            })
            if (!res.ok) throw new Error("Failed to create post")
            return res.json()
        },
        onSuccess: (data) => {
            // Redirect to the newly created live blog post!
            router.push(`/blogs/${data.slug}`)
        }
    })

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-[calc(100vh-4rem)] flex flex-col">

            {/* Top Navigation / Progress */}
            <div className="flex items-center justify-between mb-12">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => step === 2 ? setStep(1) : router.push('/dashboard')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {step === 2 ? "Back to Hook" : "Exit Editor"}
                </Button>

                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className={step === 1 ? "text-primary" : "text-muted-foreground"}>1. The Hook</span>
                    <span className="text-border">—</span>
                    <span className={step === 2 ? "text-primary" : "text-muted-foreground"}>2. The Content</span>
                </div>

                {step === 1 ? (
                    <Button
                        onClick={() => setStep(2)}
                        disabled={!title.trim()}
                        className="bg-primary text-primary-foreground"
                    >
                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => createPost.mutate()}
                        disabled={createPost.isPending || content.length < 20}
                        className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    >
                        {createPost.isPending ? "Publishing..." : "Publish Post"} <Check className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* STEP 1: THE HOOK (Title & Cover Image) */}
            {step === 1 && (
                <div className="flex-1 flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Frame your story</h2>
                        <p className="text-muted-foreground">A strong title and cover image pull readers in.</p>
                    </div>

                    {/* Cover Image Uploader Mock */}
                    <div className="relative group rounded-[2rem] border-2 border-dashed border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center overflow-hidden aspect-video max-h-[400px]">
                        {coverImage ? (
                            <>
                                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" onClick={() => setCoverImage("")}>Remove Image</Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 p-8 text-center max-w-sm">
                                <div className="p-4 rounded-full bg-card shadow-sm border border-border">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">Add a cover image</p>
                                    <p className="text-xs text-muted-foreground">Paste a high-quality image URL to make your post stand out.</p>
                                </div>
                                <Input
                                    placeholder="https://images.unsplash.com/..."
                                    className="mt-2 bg-background border-border"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Your post title here..."
                            className="w-full text-4xl md:text-5xl lg:text-6xl font-extrabold bg-transparent outline-none placeholder:text-muted-foreground/30 text-foreground resize-none tracking-tight leading-tight"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {title && (
                            <p className="mt-4 text-sm font-mono text-muted-foreground flex items-center gap-2">
                                <span className="text-primary font-bold">devloom.com/blogs/</span>
                                {slugPreview}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: THE CONTENT (Editor & Tags) */}
            {step === 2 && (
                <div className="flex-1 flex flex-col gap-6 duration-500 animate-in fade-in slide-in-from-right-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground line-clamp-1">{title}</h2>
                        <p className="text-muted-foreground text-sm">Now, write your masterpiece.</p>
                    </div>

                    {/* Tags Input Area */}
                    <div className="p-4 rounded-xl border border-border bg-card/50 shadow-sm flex flex-col gap-3">
                        <label className="text-sm font-semibold text-foreground">Add up to 5 Tags</label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors pl-3 pr-1 py-1 flex items-center gap-1 text-sm">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="rounded-full hover:bg-secondary/20 p-0.5 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}

                            {tags.length < 5 && (
                                <select
                                    className="bg-transparent border border-border rounded-md outline-none text-sm text-muted-foreground w-64 px-2 py-2"
                                    value=""
                                    onChange={(e) => {
                                        const newTag = e.target.value;
                                        if (newTag && !tags.includes(newTag)) {
                                            setTags([...tags, newTag]);
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select an existing tag...</option>
                                    {availableTags
                                        ?.filter((t: any) => !tags.includes(t.name))
                                        .map((t: any) => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Tiptap Editor inside an expanding flex container */}
                    <div className="flex-1 mt-2 mb-20">
                        <TiptapEditor content={content} onChange={setContent} />
                    </div>
                </div>
            )}

        </div>
    )
}
