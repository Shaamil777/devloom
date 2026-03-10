import prisma from "@/lib/prisma"
import { HeroBanner } from "@/components/HeroBanner"
import { FeaturedPostCard } from "@/components/FeaturedPostCard"
import { PostCard } from "@/components/PostCard"
import { TrendingTags } from "@/components/TrendingTags"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Force dynamic so it fetches fresh posts on reload
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: true,
      tags: { include: { tag: true } }
    }
  })

  // Separate posts for featured and grid
  const featuredPost = posts[0]
  const gridPosts = posts.slice(1, 5) // Up to 4 small grid posts

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full bg-background min-h-screen">

      {/* 1. Hero Banner Component */}
      <HeroBanner />

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

        {/* 2. Main Feed Column */}
        <div className="flex-1 min-w-0">

          {/* Bento Grid: New & Popular */}
          {posts.length > 0 && (
            <div className="mb-14 border-b border-border/50 pb-14">
              <h2 className="flex items-center text-[13px] font-bold tracking-widest text-[#94A3B8] uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                New & Popular
              </h2>

              <div className="flex flex-col gap-6">
                {/* Horizontal Full Width Featured Post */}
                {featuredPost && (
                  <div className="w-full">
                    <FeaturedPostCard post={featuredPost} />
                  </div>
                )}

                {/* Grid Posts below Featured */}
                {gridPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-2">
                    {gridPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>

              {/* Explore More Button */}
              {posts.length > 0 && (
                <div className="mt-12 flex justify-center w-full">
                  <Link
                    href="/blogs"
                    className="flex items-center gap-2 group px-8 py-3.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-full transition-all duration-300"
                  >
                    <span>Explore More Articles</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {posts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground italic text-lg opacity-60">No published articles yet... Start writing!</p>
            </div>
          )}
        </div>

        {/* 3. Right Sidebar */}
        <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
          <TrendingTags />
        </aside>
      </div>
    </main>
  )
}