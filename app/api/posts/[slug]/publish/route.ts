import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        const { slug } = await params

        const existingPost = await prisma.post.findUnique({
            where: { slug }
        })

        if (!existingPost) {
            return Response.json({ error: "Post not found" }, { status: 404 })
        }

        if (existingPost.authorId !== user?.id) {
            return Response.json({ error: "Forbidden" }, { status: 403 })
        }

        const post = await prisma.post.update({
            where: { slug },
            data: {
                published: true
            }
        })

        return Response.json(post)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to publish post" }, { status: 500 })
    }
}