'use client';

import React, { useEffect, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface CyberEditorProps {
  journalId: string;
  initialContentJson?: string;
  snapshotToRestoreJson?: string;
  markdownTemplate?: string;
  onStatsChange?: (stats: { words: number; readTime: number; codeBlocks: number; images: number; commands: number }) => void;
  onAutoSave?: (contentJson: string, contentMarkdown: string, wordCount: number) => void;
  onSnapshot?: (contentJson: string, contentMarkdown: string) => void;
}

export default function CyberEditor({ journalId, initialContentJson, snapshotToRestoreJson, markdownTemplate, onStatsChange, onAutoSave, onSnapshot }: CyberEditorProps) {
  const [content, setContent] = useState<string>(initialContentJson || '');
  const lastSavedHash = React.useRef<string>('');
  const lastSnapshotTime = React.useRef<number>(Date.now());
  
  // Initialize BlockNote
  const editor = useCreateBlockNote({
    initialContent: initialContentJson ? JSON.parse(initialContentJson) : undefined,
    uploadFile: async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  });

  // Load markdown template if empty
  useEffect(() => {
    if (editor && !initialContentJson && markdownTemplate) {
      async function loadMarkdown() {
        const blocks = await editor.tryParseMarkdownToBlocks(markdownTemplate!);
        editor.replaceBlocks(editor.document, blocks);
      }
      loadMarkdown();
    }
  }, [editor, initialContentJson, markdownTemplate]);

  // Restore from snapshot
  useEffect(() => {
    if (editor && snapshotToRestoreJson) {
      const blocks = JSON.parse(snapshotToRestoreJson);
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [editor, snapshotToRestoreJson]);

  // Handle manual snapshot on blur
  useEffect(() => {
    const handleBlur = () => {
      if (editor && onSnapshot) {
        const blocks = editor.document;
        Promise.resolve(editor.blocksToMarkdownLossy(blocks)).then((markdown) => {
          onSnapshot(JSON.stringify(blocks), markdown);
          lastSnapshotTime.current = Date.now();
        });
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [editor, onSnapshot]);

  // Calculate stats and trigger autosave
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      const blocks = editor.document;
      
      // Calculate Stats
      let wordCount = 0;
      let codeBlocks = 0;
      let images = 0;
      let commands = 0;

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

      // Auto-save stringified blocks AND markdown
      if (onAutoSave) {
        const jsonStr = JSON.stringify(blocks);
        // Only save if content changed
        if (jsonStr !== lastSavedHash.current) {
          Promise.resolve(editor.blocksToMarkdownLossy(blocks)).then((markdown) => {
            onAutoSave(jsonStr, markdown, wordCount);
            lastSavedHash.current = jsonStr;
            
            // 10 minute snapshot
            if (onSnapshot && Date.now() - lastSnapshotTime.current > 10 * 60 * 1000) {
              onSnapshot(jsonStr, markdown);
              lastSnapshotTime.current = Date.now();
            }
          });
        }
      }

    }, 2000); // 2-second autosave loop

    return () => clearInterval(interval);
  }, [editor, onStatsChange, onAutoSave, onSnapshot]);

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
