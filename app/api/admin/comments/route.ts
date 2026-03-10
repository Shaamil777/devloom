import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (admin?.role !== "ADMIN") {
            return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }

        const comments = await prisma.comment.findMany({
            include: {
                author: { select: { name: true, email: true } },
                post: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return Response.json(comments);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
