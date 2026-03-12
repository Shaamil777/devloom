import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { published } = body;

        if (typeof published !== "boolean") {
            return Response.json({ error: "Published status must be a boolean" }, { status: 400 });
        }

        const post = await prisma.post.update({
            where: { id },
            data: { published }
        });

        return Response.json(post);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to update post status" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }

        const { id } = await params;

        await prisma.post.delete({
            where: { id }
        });

        return Response.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
