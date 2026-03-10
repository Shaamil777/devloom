import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {

        const { slug } = await params;

        const post = await prisma.post.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!post) {
            return Response.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: { postId: post.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 20
        });

        return Response.json(comments);

    } catch (error) {

        console.error(error)

        return Response.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );

    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const body = await req.json();
        const { content } = body;

        if (!content || content.trim() === "") {
            return Response.json({ error: "Comment content is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const post = await prisma.post.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: user.id,
                postId: post.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                }
            }
        });

        return Response.json(comment);

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to create comment" }, { status: 500 });
    }
}