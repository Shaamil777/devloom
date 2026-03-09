import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: Request) {
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
        return Response.json(user)
    } catch (error) {
        console.error(error)
        return Response.json({ message: "Failed to fetch user" }, { status: 500 })
    }
}


export async function PATCH(req: Request) {
    try {


        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email
            }
        })

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 })
        }

        const body = await req.json()

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: body.name,
                image: body.image
            }
        })
        return Response.json(updatedUser)
    } catch (error) {
        console.error(error)
        return Response.json({ message: "Failed to update user" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }
        await prisma.user.delete({
            where: {
                email: session.user.email
            }
        })
        return Response.json({
            message: "Account deleted"
        })
    } catch (error) {
        console.error(error)

        return Response.json(
            { message: "Failed to delete account" },
            { status: 500 }
        )

    }
}