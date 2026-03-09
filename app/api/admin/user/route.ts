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
                email: session.user.email
            }
        })
        if(user?.role !== "ADMIN"){
            return Response.json({error:"Forbidden: Admins only"},{status:403})
        }

        const users = await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                email:true,
                image:true,
                role:true,
                createdAt:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return Response.json(users)
    } catch (error) {
        return Response.json({
            error:"Failed to fetch users"
        },{status:500})
    }
}