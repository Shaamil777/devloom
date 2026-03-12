import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devloom.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin',
                '/admin/*',
                '/api/admin/*',
                '/dashboard', // Private user dashboard
                '/dashboard/*',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
