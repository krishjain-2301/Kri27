'use client';

import React, { useEffect, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface CyberEditorProps {
  initialContent?: string;
  markdownTemplate?: string;
  onStatsChange?: (stats: { words: number; readTime: number; codeBlocks: number; images: number; commands: number }) => void;
  onAutoSave?: (content: string) => void;
}

export default function CyberEditor({ initialContent, markdownTemplate, onStatsChange, onAutoSave }: CyberEditorProps) {
  const [content, setContent] = useState<string>(initialContent || '');
  
  // Initialize BlockNote
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  // Load markdown template if empty
  useEffect(() => {
    if (editor && !initialContent && markdownTemplate) {
      async function loadMarkdown() {
        const blocks = await editor.tryParseMarkdownToBlocks(markdownTemplate!);
        editor.replaceBlocks(editor.document, blocks);
      }
      loadMarkdown();
    }
  }, [editor, initialContent, markdownTemplate]);

  // Calculate stats and trigger autosave
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      const blocks = editor.document;
      
      // Calculate Stats
      let wordCount = 0;
      let codeBlocks = 0;
      let images = 0;
      let commands = 0; // Simple heuristic: number of inline code strings or bash blocks

      // Quick recursive block parsing for stats
      const traverse = (blocksArr: any[]) => {
        blocksArr.forEach(b => {
          if (b.type === 'paragraph' || b.type === 'heading') {
            const text = b.content?.map((c: any) => c.text).join(' ') || '';
            wordCount += text.split(/\s+/).filter((w: string) => w.length > 0).length;
          }
          if (b.type === 'codeBlock') {
            codeBlocks++;
            commands += b.content?.map((c: any) => c.text).join(' ').split('\n').filter((l: string) => l.trim().length > 0).length || 0;
          }
          if (b.type === 'image') images++;
          
          if (b.children) traverse(b.children);
        });
      };
      traverse(blocks);

      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      if (onStatsChange) {
        onStatsChange({ words: wordCount, readTime, codeBlocks, images, commands });
      }

      // Auto-save stringified blocks
      if (onAutoSave) {
        onAutoSave(JSON.stringify(blocks));
      }

    }, 2000); // 2-second autosave

    return () => clearInterval(interval);
  }, [editor, onStatsChange, onAutoSave]);

  return (
    <div className="cyber-editor-wrapper bg-transparent text-white min-h-[500px] w-full">
      <BlockNoteView 
        editor={editor} 
        theme="dark" 
        className="min-h-[500px] w-full"
      />
    </div>
  );
}
