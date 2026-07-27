'use client';

import { cn } from '@/lib/utils';
import { Toolbar } from './toolbar';
import { Sidebar } from './sidebar';
import { CanvasArea } from './canvas-area';
import { TimelineArea } from './timeline-area';
import { InspectorPanel } from './inspector-panel';

export function MainLayout() {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background font-sans antialiased')}>
      <Toolbar />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CanvasArea />
        <InspectorPanel />
      </main>
      <TimelineArea />
    </div>
  );
}
