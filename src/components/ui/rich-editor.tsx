import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarBtn({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`px-2 py-1 text-xs rounded transition-colors ${active ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder = "Введите текст...", minHeight = 100 }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit] text-sm text-zinc-200 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border border-zinc-700 focus-within:border-red-600 transition-colors bg-zinc-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-zinc-700 bg-zinc-800">
        <ToolbarBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>Б</strong>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>К</em>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">Ч</span>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">З</span>
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Список
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Список
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().undo().run()}>
          ↩
        </ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().redo().run()}>
          ↪
        </ToolbarBtn>
      </div>
      {/* Content */}
      <div style={{ minHeight }} className="px-3 py-2.5">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #71717a;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .tiptap ul { list-style: disc; padding-left: 1.25rem; }
        .tiptap ol { list-style: decimal; padding-left: 1.25rem; }
        .tiptap blockquote { border-left: 3px solid #dc2626; padding-left: 0.75rem; color: #a1a1aa; font-style: italic; }
        .tiptap hr { border-color: #3f3f46; margin: 0.5rem 0; }
        .tiptap strong { font-weight: 700; color: #fff; }
      `}</style>
    </div>
  );
}
