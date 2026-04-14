import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { useRef } from "react";

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const COLORS = [
  { label: "Красный", value: "#dc2626" },
  { label: "Оранжевый", value: "#ea580c" },
  { label: "Жёлтый", value: "#ca8a04" },
  { label: "Зелёный", value: "#16a34a" },
  { label: "Синий", value: "#2563eb" },
  { label: "Серый", value: "#71717a" },
  { label: "Белый", value: "#ffffff" },
];

function ToolbarBtn({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`px-2 py-1 text-xs rounded transition-colors ${active ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-700"}`}
    >
      {children}
    </button>
  );
}

function ColorPicker({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;
  const currentColor = editor.getAttributes("textStyle").color as string | undefined;

  return (
    <div className="flex items-center gap-0.5">
      {COLORS.map(c => (
        <button
          key={c.value}
          type="button"
          title={c.label}
          onMouseDown={e => {
            e.preventDefault();
            if (currentColor === c.value) {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor(c.value).run();
            }
          }}
          className="w-4 h-4 rounded-sm border border-zinc-600 transition-all hover:scale-110"
          style={{ background: c.value, outline: currentColor === c.value ? "2px solid white" : "none", outlineOffset: "1px" }}
        />
      ))}
      <div className="relative">
        <button
          type="button"
          title="Произвольный цвет"
          onMouseDown={e => { e.preventDefault(); inputRef.current?.click(); }}
          className="w-4 h-4 rounded-sm border border-zinc-500 bg-gradient-to-br from-red-500 via-green-400 to-blue-500 hover:scale-110 transition-all"
        />
        <input
          ref={inputRef}
          type="color"
          className="absolute opacity-0 w-0 h-0"
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        />
      </div>
      {currentColor && (
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().unsetColor().run()} title="Сбросить цвет">
          ✕
        </ToolbarBtn>
      )}
    </div>
  );
}

export default function RichEditor({ value, onChange, placeholder = "Введите текст...", minHeight = 100 }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      TextStyle,
      Color,
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

  if (!editor) return null;

  return (
    <div className="border border-zinc-700 focus-within:border-red-600 transition-colors bg-zinc-900">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-zinc-700 bg-zinc-800">
        <ToolbarBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Жирный">
          <strong>Б</strong>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Курсив">
          <em>К</em>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Подчёркнутый">
          <span className="underline">Ч</span>
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Зачёркнутый">
          <span className="line-through">З</span>
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Маркированный список">
          • Список
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Нумерованный список">
          1. Список
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Цитата">
          ❝
        </ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Разделитель">
          —
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <span className="text-zinc-500 text-xs mr-1">Цвет:</span>
        <ColorPicker editor={editor} />
        <div className="w-px h-4 bg-zinc-600 mx-1" />
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().undo().run()} title="Отменить">↩</ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().redo().run()} title="Повторить">↪</ToolbarBtn>
      </div>
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
        .tiptap p { margin-bottom: 0.35em; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap li p { margin-bottom: 0; }
      `}</style>
    </div>
  );
}
