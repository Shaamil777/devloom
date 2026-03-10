import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function GET(req:Request){
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return Response.json({message:"Unauthorized"},{status:401})
        }
        const user = await prisma.user.findUnique({
            where:{
                email:session.user.email
            }
        })
        if(user?.role!=="ADMIN"){
            return Response.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }
        const posts = await prisma.post.findMany({
            select:{
                title:true,
                content:true,
                published:true,
                createdAt:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return Response.json(posts)
    } catch (error) {
         return Response.json({
            error:"Failed to fetch posts"
        },{status:500})
    }
}