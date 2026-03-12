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
            where: {
                email: session.user.email
            }
        })

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 })
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id
            },
            include: {
                tags: {
                    include: { tag: true }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        savedBy: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return Response.json(posts)
    } catch (error) {
        console.error(error)
        return Response.json({ message: "Failed to fetch posts" }, { status: 500 })
    }
}