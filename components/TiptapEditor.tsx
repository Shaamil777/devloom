"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapEditorProps {
    content: string;
    onChange: (richText: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary max-w-none min-h-[400px] outline-none p-6 text-lg leading-relaxed',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">Loading editor...</div>
    }

    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
            <div className="bg-muted flex items-center gap-2 p-2 border-b border-border text-foreground">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('bold') ? 'bg-card font-bold text-primary shadow-sm' : ''}`}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('italic') ? 'bg-card italic text-primary shadow-sm' : ''}`}
                >
                    Italic
                </button>
                <div className="w-px h-6 bg-border mx-2"></div>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-card font-bold text-primary shadow-sm' : ''}`}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-card font-bold text-primary shadow-sm' : ''}`}
                >
                    H3
                </button>
                <div className="w-px h-6 bg-border mx-2"></div>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-card transition-colors line-through ${editor.isActive('strike') ? 'bg-card text-primary shadow-sm' : ''}`}
                >
                    Strike
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-card transition-colors font-mono text-sm ${editor.isActive('code') ? 'bg-card text-primary shadow-sm' : ''}`}
                >
                    Code
                </button>
                <div className="w-px h-6 bg-border mx-2"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('bulletList') ? 'bg-card text-primary shadow-sm' : ''}`}
                >
                    &bull; List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('orderedList') ? 'bg-card text-primary shadow-sm' : ''}`}
                >
                    1. List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('blockquote') ? 'bg-card text-primary shadow-sm' : ''}`}
                >
                    Quote
                </button>
            </div>

            <div className="bg-background w-full h-full overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
