'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Plus,
  Scissors,
  Trash2,
  Copy,
  RotateCcw,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  LayoutGrid,
} from 'lucide-react';

export function Toolbar() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-5 w-5 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-4z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-foreground">Video Editor</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Import media">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Split clip">
            <Scissors className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Delete clip">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Duplicate clip">
            <Copy className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Undo">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Redo">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Export">
            <Download className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Zoom in">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Zoom out">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Fit timeline">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Canvas resize">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
