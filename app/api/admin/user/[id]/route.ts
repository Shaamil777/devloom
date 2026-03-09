import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
    try {
        const {id} = await params
        const session =await getServerSession(authOptions)
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
        await prisma.user.delete({
            where:{
                id:id
            }
        })
        return Response.json({message:"Deleted User Successfully"})
    } catch (error) {
         return Response.json({
            error:"Failed to fetch users"
        },{status:500})
    }
}