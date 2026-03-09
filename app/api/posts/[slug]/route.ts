import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {

    const { slug } = await params

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            tags: {
                include: { tag: true }
            }
        }
    })

    if (!post) {
        return Response.json(
            { error: "Post not found" },
            { status: 404 }
        )
    }

    return Response.json(post)
}


export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        const { slug } = await params
        const body = await req.json()

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
                title: body.title,
                content: body.content
            }
        })

        return Response.json(post)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
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

        await prisma.post.delete({
            where: {
                slug: slug
            }
        })

        return Response.json({ message: "Post Deleted Successfully" })
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to delete post" }, { status: 500 })
    }
}