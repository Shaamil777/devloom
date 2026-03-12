import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return Response.json(tags);
    } catch (error) {
        return Response.json({ message: "Error fetching tags" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const body = await req.json();
        const { name, slug } = body;
        
        if (!name || !slug) {
            return Response.json({ message: "Name and slug are required" }, { status: 400 });
        }

        const existingTag = await prisma.tag.findUnique({ where: { slug } });
        if (existingTag) {
            return Response.json({ message: "Tag already exists" }, { status: 409 });
        }

        const tag = await prisma.tag.create({
            data: { name, slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
        });
        return Response.json(tag);
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Failed to create tag" }, { status: 500 });
    }
}