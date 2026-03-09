import prisma from "@/lib/prisma";

export async function GET(
 req: Request,
 { params }: { params: Promise<{ slug: string }> }
){
 try {

  const { slug } = await params;

  const post = await prisma.post.findUnique({
   where:{ slug },
   select:{ id:true }
  });

  if(!post){
   return Response.json(
    {error:"Post not found"},
    {status:404}
   );
  }

  const comments = await prisma.comment.findMany({
   where:{ postId:post.id },
   include:{
    author:{
     select:{
      id:true,
      name:true,
      image:true
     }
    }
   },
   orderBy:{
    createdAt:"desc"
   },
   take:20
  });

  return Response.json(comments);

 } catch (error) {

  console.error(error)

  return Response.json(
   {error:"Failed to fetch comments"},
   {status:500}
  );

 }
}