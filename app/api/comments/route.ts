import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        const body = await req.json()

        const post = await prisma.post.findUnique({
            where: { id: body.postId }
        })

        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 })
        }

        const comment = await prisma.comment.create({
            data: {
                content: body.content,
                postId: body.postId,
                authorId: user.id
            }
        })

        return Response.json(comment)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to create comment" }, { status: 500 })
    }
}
