'use client';

import { cn } from '@/lib/utils';
import { Film } from 'lucide-react';

export function CanvasArea() {
  return (
    <section className={cn('relative flex flex-1 flex-col overflow-hidden')}>
      {/* Canvas Toolbar */}
      <div className="flex items-center gap-4 border-b border-border bg-card/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Select (V)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </button>
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Blade (B)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Hand Tool (H)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6M6 12L4.5 10.5M6 12L4.5 13.5"
              />
            </svg>
          </button>
        </div>
        <div className="mx-2 h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">100%</span>
          <input type="range" min="25" max="200" value="100" className="h-2 w-32 accent-primary" />
          <span className="text-sm text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Canvas / Preview Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Video Preview Canvas */}
        <div className="relative flex-1 bg-muted/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Film className="mx-auto mb-3 h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">Video Preview</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Drop media to timeline to preview
              </p>
            </div>
          </div>
          {/* Konva Stage will be mounted here */}
          <div id="konva-stage" className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
