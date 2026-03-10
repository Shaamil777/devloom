import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req:Request){
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return Response.json({
                message:"Unauthorized"
            },{status:401})
        }
        const user = await prisma.user.findUnique({
            where:{
                email:session.user.email
            }
        })
        if(user?.role!=="ADMIN"){
            return Response.json({
                error:"Forbidden: Admins only"
            },{status:403})
        }
        const body = await req.json()
        const {name,slug} = body
        
        if(!name || !slug){
            return Response.json(
                {message:"Name and slug are required"},
                {status:400}
            )
        }
        const existingTag = await prisma.tag.findUnique({
            where:{slug:slug}
        })
        if(existingTag){
             return Response.json(
            { error: "Tag already exists" },
            { status: 409 }
        )
        }
        const tag = await prisma.tag.create({
            data:{
                name:name,
                slug:slug
            }
        })
        return Response.json(tag)
    } catch (error) {
        console.error(error)

        return Response.json(
        { error: "Failed to create tag" },
        { status: 500 }
        )
    }
}