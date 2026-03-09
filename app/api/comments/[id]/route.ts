import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        const { id } = await params

        const comment = await prisma.comment.findUnique({
            where: { id }
        })

        if (!comment) {
            return Response.json({ error: "Comment not found" }, { status: 404 })
        }

        if (comment.authorId !== user?.id) {
            return Response.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.comment.delete({
            where: {
                id: id
            }
        })
        return Response.json({ message: "Comment Deleted Successfully" })
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to delete comment" }, { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    try {

        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()

        const { content } = body

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })

        const comment = await prisma.comment.findUnique({
            where: { id }
        })

        if (!comment) {
            return Response.json(
                { error: "Comment not found" },
                { status: 404 }
            )
        }

        if (comment.authorId !== user?.id) {
            return Response.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        const updatedComment = await prisma.comment.update({
            where: { id },
            data: { content }
        })

        return Response.json(updatedComment)

    } catch (error) {

        console.error(error)

        return Response.json(
            { error: "Failed to update comment" },
            { status: 500 }
        )

    }
}