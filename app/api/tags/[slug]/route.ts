import prisma from "@/lib/prisma";

export async function GET(req:Request,{params}:{params:Promise<{slug:string}>}){
    try {
        const {slug} = await params
        const posts = await prisma.post.findMany({
            where:{
                published:true,
                tags:{
                    some:{
                        tag:{
                            slug:slug
                        }
                    }
                }
            },
            include:{
                author:true,
                tags:{
                    include:{
                        tag:true
                    }
                }
            }
        })
        return Response.json(posts)
    } catch (error) {
        return Response.json({error:"Failed to fetch posts"},{status:500})
    }
}