import prisma from "@/lib/prisma";



export async function GET(req:Request,{params}:{params:{slug:string}}){
    const post = await prisma.post.findUnique({
        where:{
            slug:params.slug
        },
        include:{
            author:true,
            comments:true,
            tags:{
                include:{
                    tag:true
                }
            }
        }
    })

    return Response.json(post)
}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
    try {
        const {id} = await params
        const body = await req.json()

        const post = await prisma.post.update({
            where:{id},
            data:{
                title:body.title,
                content:body.content
            }
        })

        return Response.json(post)
    } catch (error) {
        console.error(error)

    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    )
    }
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
    try {
        const {id} = await params
        await prisma.post.delete({
            where:{
                id:id
            }
        })

        return Response.json({message:"Post Deleted Successfully"})
    } catch (error) {
        console.error(error)

    return Response.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
    }
}