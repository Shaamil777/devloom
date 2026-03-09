import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const query = searchParams.get("q")

        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: query || "",
                    mode: "insensitive"
                },
                published: true
            }
        })

        return Response.json(posts)
    } catch (error) {
        console.error(error)
        return Response.json({ error: "Failed to search posts" }, { status: 500 })
    }
}