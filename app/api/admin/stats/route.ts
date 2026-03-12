import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user?.role !== "ADMIN") {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const [totalUsers, totalPosts, totalComments, totalTags] = await Promise.all([
            prisma.user.count(),
            prisma.post.count(),
            prisma.comment.count(),
            prisma.tag.count()
        ])

        const platformActivityData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            d.setHours(0,0,0,0);
            const nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);

            const [usersCount, postsCount] = await Promise.all([
                prisma.user.count({ where: { createdAt: { gte: d, lt: nextDay } } }),
                prisma.post.count({ where: { createdAt: { gte: d, lt: nextDay } } })
            ]);

            platformActivityData.push({
                name: days[d.getDay()],
                users: usersCount,
                posts: postsCount
            });
        }

        return Response.json({
            totalUsers,
            totalPosts,
            totalComments,
            totalTags,
            activityData: platformActivityData
        })
    } catch (error) {
        console.error(error)
        return Response.json({ message: "Failed to fetch admin stats" }, { status: 500 })
    }
}
