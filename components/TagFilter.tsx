"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Tag {
    id: string
    name: string
    slug: string
}

interface TagFilterProps {
    tags: Tag[]
    currentTag?: string
}

export function TagFilter({ tags, currentTag }: TagFilterProps) {
    const [expanded, setExpanded] = useState(false)
    const LIMIT = 8

    // Automatically expand if the current tag is outside the initial limit
    useEffect(() => {
        if (currentTag && !expanded) {
            const tagIndex = tags.findIndex((t) => t.slug === currentTag)
            if (tagIndex >= LIMIT) {
                setExpanded(true)
            }
        }
    }, [currentTag, tags, expanded])

    const showMoreBtn = tags.length > LIMIT
    const visibleTags = expanded ? tags : tags.slice(0, LIMIT)

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 pb-8 border-b border-border/50">
            <Link href="/blogs" scroll={false}>
                <Badge
                    variant={!currentTag ? "default" : "outline"}
                    className={`text-sm px-5 py-2 cursor-pointer transition-all ${
                        !currentTag 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                    All Posts
                </Badge>
            </Link>
            
            {visibleTags.map(tag => (
                <Link key={tag.id} href={`/blogs?tag=${tag.slug}`} scroll={false}>
                    <Badge
                        variant={currentTag === tag.slug ? "default" : "outline"}
                        className={`text-sm px-5 py-2 cursor-pointer transition-all ${
                            currentTag === tag.slug 
                                ? 'bg-[#F97316] text-white hover:bg-[#F97316]/90 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] border-transparent' 
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tag.name}
                    </Badge>
                </Link>
            ))}

            {showMoreBtn && (
                <Badge 
                    onClick={() => setExpanded(!expanded)}
                    variant="outline" 
                    className="text-sm px-5 py-2 cursor-pointer transition-all hover:bg-muted text-muted-foreground hover:text-foreground border-dashed gap-1 flex items-center"
                >
                    {expanded ? "Show Less" : `+${tags.length - LIMIT} More`}
                    {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Badge>
            )}
        </div>
    )
}
