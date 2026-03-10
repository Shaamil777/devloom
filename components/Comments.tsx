"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Trash2, Edit2, X, Check } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        image: string;
        email?: string;
    };
}

export function Comments({ postSlug }: { postSlug: string }) {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [content, setContent] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")

    // Fetch comments
    const { data: comments = [], isLoading } = useQuery<Comment[]>({
        queryKey: ['comments', postSlug],
        queryFn: async () => {
            const res = await fetch(`/api/posts/${postSlug}/comments`)
            if (!res.ok) throw new Error("Failed to fetch comments")
            return res.json()
        }
    })

    // Post comment mutation
    const addComment = useMutation({
        mutationFn: async (newComment: string) => {
            const res = await fetch(`/api/posts/${postSlug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment })
            })
            if (!res.ok) throw new Error("Failed to post comment")
            return res.json()
        },
        onSuccess: () => {
            setContent("")
            queryClient.invalidateQueries({ queryKey: ['comments', postSlug] })
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (content.trim()) {
            addComment.mutate(content)
        }
    }

    const deleteComment = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Failed to delete comment")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postSlug] })
        }
    })

    const editComment = useMutation({
        mutationFn: async ({ id, newContent }: { id: string, newContent: string }) => {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent })
            })
            if (!res.ok) throw new Error("Failed to edit comment")
            return res.json()
        },
        onSuccess: () => {
            setEditingId(null)
            setEditContent("")
            queryClient.invalidateQueries({ queryKey: ['comments', postSlug] })
        }
    })

    const handleEditStart = (comment: Comment) => {
        setEditingId(comment.id)
        setEditContent(comment.content)
    }

    const handleEditSave = () => {
        if (editContent.trim() && editingId) {
            editComment.mutate({ id: editingId, newContent: editContent })
        }
    }

    return (
        <section className="mt-16 pt-10 border-t border-border" id="comments">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                    Comments <span className="text-muted-foreground text-lg font-normal ml-2">({comments.length})</span>
                </h2>
            </div>

            {/* Comment Form */}
            <div className="mb-10 bg-card p-6 rounded-2xl border border-border shadow-sm">
                {!session ? (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">You must be signed in to leave a comment.</p>
                        <Button variant="outline" className="px-8" onClick={() => window.location.href = '/login'}>
                            Sign In to Comment
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10 border border-border shrink-0 hidden sm:block">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                    {session.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="What are your thoughts on this?"
                                    className="min-h-[100px] resize-y bg-background border-border focus-visible:ring-primary/50 text-foreground text-base"
                                    value={content}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                    disabled={addComment.isPending}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={!content.trim() || addComment.isPending}
                                className="bg-primary text-primary-foreground shadow-sm shadow-primary/20 flex items-center gap-2 font-bold px-6"
                            >
                                {addComment.isPending ? "Posting..." : "Post Comment"}
                                {!addComment.isPending && <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground animate-pulse">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-xl bg-card/50">
                    <p className="text-muted-foreground">No comments yet. Be the first to start the conversation!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <Avatar className="h-10 w-10 border border-border shrink-0 mt-1">
                                <AvatarImage src={comment.author.image || ""} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                    {comment.author.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-card p-5 rounded-2xl border border-border shadow-sm group-hover:border-border/80 transition-colors relative">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground">{comment.author.name}</span>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {format(new Date(comment.createdAt), "MMM d, yyyy")}
                                        </span>
                                    </div>

                                    {session?.user?.email === comment.author.email && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditStart(comment)}
                                                className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                                                title="Edit comment"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-card border-border sm:max-w-[425px]">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-foreground">Delete Comment</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-muted-foreground">
                                                            Are you sure you want to delete this comment? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-muted">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteComment.mutate(comment.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                </div>

                                {editingId === comment.id ? (
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[80px] text-sm bg-background/50"
                                            autoFocus
                                        />
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(null)}
                                                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3.5 w-3.5 mr-1" /> Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleEditSave}
                                                disabled={!editContent.trim() || editComment.isPending}
                                                className="h-8 text-xs"
                                            >
                                                <Check className="h-3.5 w-3.5 mr-1" /> Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
