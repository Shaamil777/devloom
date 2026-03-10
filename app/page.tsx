import prisma from "@/lib/prisma"
import { HeroBanner } from "@/components/HeroBanner"
import { FeaturedPostCard } from "@/components/FeaturedPostCard"
import { PostCard } from "@/components/PostCard"
import { ListPostCard } from "@/components/ListPostCard"
import { TrendingTags } from "@/components/TrendingTags"

// Force dynamic so it fetches fresh posts on reload
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      tags: { include: { tag: true } }
    }
  })

  // Separate posts for grid vs list to match Hashnode style
  const featuredPost = posts[0]
  const gridPosts = posts.slice(1, 5) // Next 4 posts in small grid
  const listPosts = posts.slice(5) // Remaining posts in list

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large Featured Post spans 2 columns */}
                {featuredPost && (
                  <div className="md:col-span-2 md:row-span-2">
                    <FeaturedPostCard post={featuredPost} />
                  </div>
                )}

                {/* Right Side Compact Grid Posts */}
                <div className="grid grid-cols-1 gap-6 md:col-span-1">
                  {gridPosts.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              {/* Row 2 of Compact Grid Posts if available */}
              {gridPosts.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {gridPosts.slice(2, 5).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* List View: Rest of the Posts */}
          {listPosts.length > 0 && (
            <div>
              <div className="flex flex-col gap-2">
                {listPosts.map((post) => (
                  <ListPostCard key={post.id} post={post} />
                ))}
              </div>
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