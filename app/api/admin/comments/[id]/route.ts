import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (admin?.role !== "ADMIN") {
            return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: id }
        });

        return Response.json({ message: "Comment deleted successfully by Admin" });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
