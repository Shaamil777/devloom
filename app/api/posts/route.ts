import prisma from "@/lib/prisma";

export async function GET() {
    const posts = await prisma.post.findMany({
        include: {
            author:true,
            tags:{
                include:{
                    tag:true
                }
            }
        }
    })

    return Response.json(posts)
}

export async function POST(req:Request){
    const body = await req.json();

    const post = await prisma.post.create({
        data:{
            title:body.title,
            slug:body.slug,
            content:body.content,
            coverImage:body.coverImage,
            authorId:body.authorId
        }
    })
    return Response.json(post)
}

