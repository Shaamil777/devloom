import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, email: true, image: true }
                },
                _count: {
                    select: { comments: true, likes: true }
                }
            }
        });
        return Response.json(posts);
    } catch (error) {
        return Response.json({ message: "Error fetching posts" }, { status: 500 });
    }
}