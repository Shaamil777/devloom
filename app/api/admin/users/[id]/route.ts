import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const body = await req.json();
        const { role } = body;
        
        if (role !== "USER" && role !== "ADMIN") return Response.json({ message: "Invalid role" }, { status: 400 });
        
        const { id } = await params;

        const user = await prisma.user.update({
            where: { id },
            data: { role }
        });
        return Response.json(user);
    } catch (error) {
        return Response.json({ message: "Error updating user" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const { id } = await params;

        if (session.user.id === id) {
            return Response.json({ message: "Cannot delete yourself" }, { status: 400 });
        }
        await prisma.user.delete({
            where: { id }
        });
        return Response.json({ message: "Deleted" });
    } catch (error) {
        console.error("Error deleting user: ", error);
        return Response.json({ message: "Error deleting user" }, { status: 500 });
    }
}
