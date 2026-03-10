import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { stat } from "fs"

export async function PATCH(
 req: Request,
 { params }: { params: Promise<{ id: string }> }
){

 try {

  const { id } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
   return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
   )
  }

  const admin = await prisma.user.findUnique({
   where: {
    email: session.user.email
   }
  })

  if (admin?.role !== "ADMIN") {
   return Response.json(
    { error: "Forbidden: Admins only" },
    { status: 403 }
   )
  }

  const { name } = await req.json()

  if (!name) {
   return Response.json(
    { error: "Name is required" },
    { status: 400 }
   )
  }

  const existingTag = await prisma.tag.findUnique({
   where: { id }
  })

  if (!existingTag) {
   return Response.json(
    { error: "Tag not found" },
    { status: 404 }
   )
  }

  const tag = await prisma.tag.update({
   where: { id },
   data: { name },
   select: {
    id: true,
    name: true,
    slug: true
   }
  })

  return Response.json(tag)

 } catch (error) {

  console.error(error)

  return Response.json(
   { error: "Failed to update tag" },
   { status: 500 }
  )

 }

}


export async function DELETE(
 req: Request,
 { params }: { params: Promise<{ id: string }> }
){

 try {

  const { id } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
   return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
   )
  }

  const admin = await prisma.user.findUnique({
   where: { email: session.user.email }
  })

  if (admin?.role !== "ADMIN") {
   return Response.json(
    { error: "Forbidden: Admins only" },
    { status: 403 }
   )
  }

  const tag = await prisma.tag.findUnique({
   where: { id }
  })

  if (!tag) {
   return Response.json(
    { error: "Tag not found" },
    { status: 404 }
   )
  }

  await prisma.postTag.deleteMany({
   where: { tagId: id }
  })

  await prisma.tag.delete({
   where: { id }
  })

  return Response.json({
   message: "Tag deleted successfully"
  })

 } catch (error) {

  console.error(error)

  return Response.json(
   { error: "Failed to delete tag" },
   { status: 500 }
  )

 }

}