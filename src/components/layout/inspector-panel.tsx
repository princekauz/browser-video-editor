'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Move, Film } from 'lucide-react';

export function InspectorPanel() {
  return (
    <aside
      className={cn('flex hidden w-72 shrink-0 flex-col border-l border-border bg-card lg:flex')}
    >
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
      </div>
      <Tabs defaultValue="transform" className="flex flex-1 flex-col">
        <TabsList className="border-b border-border p-2">
          <TabsTrigger
            value="transform"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Move className="h-4 w-4" />
            Transform
          </TabsTrigger>
          <TabsTrigger
            value="properties"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Film className="h-4 w-4" />
            Video
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transform" className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Move className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-sm">Select a clip to view transform properties</p>
          </div>
        </TabsContent>
        <TabsContent value="properties" className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Settings className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-sm">Select a clip to view properties</p>
          </div>
        </TabsContent>
        <TabsContent value="video" className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Film className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-sm">Select a clip to view video info</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
