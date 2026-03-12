import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "ADMIN") return Response.json({ error: "Forbidden: Admins only" }, { status: 403 })

        const { id } = await params
        const { name } = await req.json()

        if (!name) return Response.json({ error: "Name is required" }, { status: 400 })

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        const tag = await prisma.tag.update({
            where: { id },
            data: { name, slug },
            select: { id: true, name: true, slug: true }
        })

        return Response.json(tag)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to update tag" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "ADMIN") return Response.json({ error: "Forbidden: Admins only" }, { status: 403 })

        const { id } = await params

        await prisma.tag.delete({
            where: { id }
        })

        return Response.json({ message: "Tag deleted successfully" })
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to delete tag" }, { status: 500 })
    }
}