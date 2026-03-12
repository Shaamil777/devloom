import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { posts: true, comments: true }
                }
            }
        });
        return Response.json(users);
    } catch (error) {
        return Response.json({ message: "Error fetching users" }, { status: 500 });
    }
}
