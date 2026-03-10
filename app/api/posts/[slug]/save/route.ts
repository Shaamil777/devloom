import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { slug } = await params
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return Response.json({ error: "User not found" }, { status: 404 })

        const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } })
        if (!post) return Response.json({ error: "Post not found" }, { status: 404 })

        const existingSave = await prisma.savedPost.findUnique({
            where: { userId_postId: { userId: user.id, postId: post.id } }
        })

        if (existingSave) {
            await prisma.savedPost.delete({ where: { id: existingSave.id } })
            return Response.json({ action: "unsaved", message: "Post removed from bookmarks" })
        } else {
            await prisma.savedPost.create({ data: { userId: user.id, postId: post.id } })
            return Response.json({ action: "saved", message: "Post bookmarked" })
        }
    } catch (error) {
        console.error("Save toggle error:", error)
        return Response.json({ error: "Failed to toggle save" }, { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { slug } = await params

        const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } })
        if (!post) return Response.json({ error: "Post not found" }, { status: 404 })

        let hasSaved = false
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } })
            if (user) {
                const existingSave = await prisma.savedPost.findUnique({
                    where: { userId_postId: { userId: user.id, postId: post.id } }
                })
                hasSaved = !!existingSave
            }
        }
        return Response.json({ hasSaved })
    } catch (error) {
        console.error("Fetch save error:", error)
        return Response.json({ error: "Failed to fetch save status" }, { status: 500 })
    }
}
