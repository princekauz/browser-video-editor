'use client';

import { cn } from '@/lib/utils';
import { SkipBack, Play, SkipForward, Clock } from 'lucide-react';

export function TimelineArea() {
  return (
    <footer className={cn('flex h-64 flex-col overflow-hidden border-t border-border bg-card')}>
      <div className="flex items-center justify-between border-b border-border bg-card/50 p-3">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Timeline
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Track Height:</label>
            <select className="rounded border border-input bg-background px-2 py-1 text-sm">
              <option value="small">Small</option>
              <option value="medium" selected>
                Medium
              </option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Rewind"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Play/Pause (Space)"
            >
              <Play className="h-5 w-5" />
            </button>
            <button
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Forward"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm tabular-nums">00:00:00:00</span>
          </div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="relative flex flex-1 overflow-auto">
        {/* Track Headers */}
        <div className="w-48 flex-shrink-0 overflow-y-auto border-r border-border bg-card/50">
          <div className="flex h-48 items-center justify-center border-b border-border bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground">Video 1</span>
          </div>
          <div className="flex h-48 items-center justify-center border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Video 2</span>
          </div>
          <div className="flex h-48 items-center justify-center border-b border-border bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground">Audio 1</span>
          </div>
          <div className="flex h-48 items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Audio 2</span>
          </div>
        </div>

        {/* Timeline Ruler */}
        <div className="relative flex-1">
          <div className="sticky top-0 z-10 flex h-8 items-center border-b border-border bg-background/50 px-4">
            <div className="flex flex-1 items-center justify-center">
              <div className="flex gap-16" style={{ width: '3200px' }}>
                {Array.from({ length: 33 }).map((_, i) => (
                  <div key={i} className="relative w-16">
                    <div className="absolute left-0 top-0 h-4 w-px bg-border" />
                    <span className="absolute left-0 top-4 font-mono text-xs tabular-nums text-muted-foreground">
                      {i * 5}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Tracks Content */}
          <div className="relative" style={{ width: '3200px', minWidth: '100%' }}>
            {/* Video Track 1 */}
            <div className="relative h-48 border-b border-border">
              <div className="bg-grid bg-grid-size-40 absolute inset-0 opacity-5" />
              {/* Playhead */}
              <div
                className="pointer-events-none absolute bottom-0 top-0 w-px bg-primary"
                style={{ left: '100px' }}
              />
              {/* Clip placeholder */}
              <div className="absolute left-[100px] top-2 flex h-44 w-96 items-center justify-center rounded-lg border border-primary/50 bg-primary/20">
                <span className="text-xs font-medium text-primary">Clip 1 (00:00 - 00:10)</span>
              </div>
            </div>
            {/* Video Track 2 */}
            <div className="relative h-48 border-b border-border bg-muted/30">
              <div className="bg-grid bg-grid-size-40 absolute inset-0 opacity-5" />
            </div>
            {/* Audio Track 1 */}
            <div className="relative h-48 border-b border-border">
              <div className="bg-grid bg-grid-size-40 absolute inset-0 opacity-5" />
              {/* Waveform placeholder */}
              <div className="absolute left-0 right-0 top-1/2 flex h-8 -translate-y-1/2 items-center justify-center px-4">
                <div className="flex h-full items-end gap-0.5" style={{ width: '3200px' }}>
                  {Array.from({ length: 320 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-px rounded bg-muted-foreground/30"
                      style={{ height: `${Math.random() * 8 + 2}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Audio Track 2 */}
            <div className="relative h-48 bg-muted/30">
              <div className="bg-grid bg-grid-size-40 absolute inset-0 opacity-5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
