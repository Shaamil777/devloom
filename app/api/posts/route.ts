import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                tags: {
                    include: { tag: true }
                }
            }
        })

        return Response.json(posts)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        const body = await req.json()

        const tagsToConnectOrCreate = body.tags ? body.tags.map((tagName: string) => {
            const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
                tag: {
                    connectOrCreate: {
                        where: { slug: tagSlug },
                        create: { name: tagName, slug: tagSlug }
                    }
                }
            }
        }) : [];

        const post = await prisma.post.create({
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                coverImage: body.coverImage,
                authorId: user.id,
                published: true,
                tags: {
                    create: tagsToConnectOrCreate
                }
            }
        })

        return Response.json(post)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to create post" }, { status: 500 })
    }
}