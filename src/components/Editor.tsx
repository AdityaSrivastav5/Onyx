"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { cn } from "@/lib/utils";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string;
}

export function Editor({ content, onChange, editable = true, className }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Typography,
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-w-none dark:prose-invert",
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
