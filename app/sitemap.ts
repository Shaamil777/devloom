import { MetadataRoute } from 'next'
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devloom.vercel.app';

    // Core static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Fetch dynamic published posts
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        });

        const postUrls = posts.map((post) => ({
            url: `${baseUrl}/blogs/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...routes, ...postUrls];
    } catch (error) {
        console.error("Failed to generate dynamic sitemap", error);
        return routes;
    }
}
