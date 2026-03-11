import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { slug } = await params

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        const post = await prisma.post.findUnique({
            where: { slug },
            select: { id: true }
        })

        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 })
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: post.id
                }
            }
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            })
            return Response.json({ action: "unliked", message: "Like removed" })
        } else {
            await prisma.like.create({
                data: {
                    userId: user.id,
                    postId: post.id
                }
            })
            return Response.json({ action: "liked", message: "Post liked" })
        }

    } catch (error) {
        console.error("Like toggle error:", error)
        return Response.json({ error: "Failed to toggle like" }, { status: 500 })
    }
}


export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { slug } = await params

        const post = await prisma.post.findUnique({
            where: { slug },
            select: { id: true }
        })

        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 })
        }

        const totalLikes = await prisma.like.count({
            where: { postId: post.id }
        })

        let hasLiked = false


        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            })

            if (user) {
                const existingLike = await prisma.like.findUnique({
                    where: {
                        userId_postId: {
                            userId: user.id,
                            postId: post.id
                        }
                    }
                })
                hasLiked = !!existingLike
            }
        }

        return Response.json({ totalLikes, hasLiked })

    } catch (error) {
        console.error("Fetch likes error:", error)
        return Response.json({ error: "Failed to fetch likes" }, { status: 500 })
    }
}
