import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
    try {
        const {id} = await params
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return Response.json({
                error:"Unauthorized"
            },{status:401})
        }
        const user = await prisma.user.findUnique({
            where:{
                email:session.user.email
            }
        })
        if(user?.role!=="ADMIN"){
            return Response.json({error:"Forbidden: Admins only"},{status:403})
        }
        const body = await req.json()
        const {role} = body

        if(!role){
            return Response.json(
                {error:"Role is required"},
                {status:400}
            )
        }

        const updatedUser = await prisma.user.update({
            where:{
                id:id
            },
            data:{
                role:role
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        })
        return Response.json(updatedUser)
    } catch (error) {
         console.error(error)

  return Response.json(
   { error: "Failed to update role" },
   { status: 500 }
  )
    }
}