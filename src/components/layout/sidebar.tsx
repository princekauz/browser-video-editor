'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, Film, Zap, Type, Music, LayoutTemplate } from 'lucide-react';

const sidebarTabs = [
  { id: 'project', label: 'Project', icon: FolderOpen },
  { id: 'media', label: 'Media', icon: Film },
  { id: 'effects', label: 'Effects', icon: Zap },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
] as const;

export function Sidebar() {
  return (
    <aside
      className={cn('flex hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex')}
    >
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Project
        </h2>
      </div>
      <Tabs defaultValue="media" className="flex flex-1 flex-col">
        <TabsList className="flex-row flex-col border-r border-border p-2">
          {sidebarTabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="project" className="flex-1 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Film className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm">Project panel - coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="media" className="flex-1 overflow-y-auto p-4">
          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
            <Film className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag & drop media files here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
          </div>
        </TabsContent>
        <TabsContent value="effects" className="flex-1 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Zap className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm">Effects panel - coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="text" className="flex-1 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Type className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm">Text panel - coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="audio" className="flex-1 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <Music className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm">Audio panel - coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-4">
          <div className="py-8 text-center text-muted-foreground">
            <LayoutTemplate className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm">Templates panel - coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
