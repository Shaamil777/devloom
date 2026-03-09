import prisma from "@/lib/prisma";

export async function GET(){
    const tags = await prisma.tag.findMany()
    return Response.json(tags)
}