import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 })
        }

        const [totalPosts, totalLikes, totalComments, totalSaved] = await Promise.all([
            prisma.post.count({ where: { authorId: user.id } }),
            prisma.like.count({
                where: { post: { authorId: user.id } }
            }),
            prisma.comment.count({
                where: { post: { authorId: user.id } }
            }),
            prisma.savedPost.count({
                where: { post: { authorId: user.id } }
            })
        ])

        return Response.json({
            totalPosts,
            totalLikes,
            totalComments,
            totalSaved
        })
    } catch (error) {
        console.error(error)
        return Response.json({ message: "Failed to fetch stats" }, { status: 500 })
    }
}
