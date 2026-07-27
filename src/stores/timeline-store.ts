import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateId } from '@/lib/utils'

// Command interface
interface Command {
  execute(): void | Promise<void>
  undo(): void | Promise<void>
  redo(): void | Promise<void>
  getType(): string
  getPayload(): unknown
  getTimestamp(): number
  getAffectedClipIds(): string[]
}

// Simplified history manager
function getHistoryManager(): {
  push: (command: Command) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
} {
  const history: Command[] = []
  const future: Command[] = []
  return {
    push: (command: Command) => {
      history.push(command)
      future.length = 0
    },
    undo: () => {
      if (history.length > 0) {
        const command = history.pop()!
        command.undo()
        future.push(command)
      }
    },
    redo: () => {
      if (future.length > 0) {
        const command = future.pop()!
        command.redo()
        history.push(command)
      }
    },
    canUndo: () => history.length > 0,
    canRedo: () => future.length > 0,
  }
}

// Timeline Clip
interface TimelineClip {
  id: string
  sourceId: string
  durationFrames: number
  timelineStartFrame: number
  sourceStartFrame: number
  sourceEndFrame: number
  trimStartFrame: number
  trimEndFrame: number
  zoom: number
  panX: number
  panY: number
  rotation: number
  opacity: number
  scaleX: number
  scaleY: number
  muted: boolean
  playbackRate: number
  flipX: boolean
  flipY: boolean
  crop: { x: number; y: number; width: number; height: number } | null
  trackId: string
  createdAt: number
  updatedAt: number
}

// Timeline Track
interface TimelineTrack {
  id: string
  name: string
  type: 'video' | 'audio'
  clips: string[]
  locked: boolean
  visible: boolean
  height: number
  blendMode: string
  createdAt: number
  updatedAt: number
}

// Timeline Store State
interface TimelineStoreState {
  fps: number
  currentFrame: number
  zoom: number
  tracks: Map<string, TimelineTrack>
  selectedClipIds: string[]
  history: Command[]
  future: Command[]
  
  // Settings
  setFps: (fps: number) => void
  setCurrentFrame: (frame: number) => void
  setZoom: (zoom: number) => void
  
  // Track operations
  addTrack: (name: string, type: 'video' | 'audio') => string
  removeTrack: (trackId: string) => void
  reorderTracks: (trackIds: string[]) => void
  updateTrack: (trackId: string, updates: Partial<TimelineTrack>) => void
  
  // Clip operations
  addClip: (trackId: string, clipData: Partial<TimelineClip>) => string
  removeClip: (clipId: string) => void
  moveClip: (clipId: string, newTimelineStartFrame: number, newTrackId?: string) => void
  trimClip: (clipId: string, trimStartFrame: number, trimEndFrame: number) => void
  splitClip: (clipId: string, splitFrame: number) => string
  duplicateClip: (clipId: string, newTimelineStartFrame?: number, newTrackId?: string) => string
  updateClipProperty: (clipId: string, property: string, value: unknown) => void
  
  // Selection
  selectClip: (clipId: string, multi?: boolean) => void
  clearSelection: () => void
  selectAllClips: () => void
  
  // History
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

// Default tracks
const DEFAULT_TRACKS: [string, TimelineTrack][] = [
  ['video-1', {
    id: 'video-1',
    name: 'Video 1',
    type: 'video',
    clips: [],
    locked: false,
    visible: true,
    height: 80,
    blendMode: 'normal',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }],
  ['video-2', {
    id: 'video-2',
    name: 'Video 2',
    type: 'video',
    clips: [],
    locked: false,
    visible: true,
    height: 80,
    blendMode: 'normal',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }],
  ['audio-1', {
    id: 'audio-1',
    name: 'Audio 1',
    type: 'audio',
    clips: [],
    locked: false,
    visible: true,
    height: 60,
    blendMode: 'normal',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }],
  ['audio-2', {
    id: 'audio-2',
    name: 'Audio 2',
    type: 'audio',
    clips: [],
    locked: false,
    visible: true,
    height: 60,
    blendMode: 'normal',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }],
]

export const useTimelineStore = create<TimelineStoreState>()(
  persist(
    (set, get) => ({
      fps: 30,
      currentFrame: 0,
      zoom: 1,
      tracks: new Map(DEFAULT_TRACKS),
      selectedClipIds: [],
      history: [],
      future: [],
      
      setFps: (fps) => set({ fps }),
      setCurrentFrame: (frame) => set({ currentFrame: frame }),
      setZoom: (zoom) => set({ zoom }),
      
      addTrack: (name, type) => {
        const id = generateId()
        const track: TimelineTrack = {
          id,
          name,
          type,
          clips: [],
          locked: false,
          visible: true,
          height: type === 'video' ? 80 : 60,
          blendMode: 'normal',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => {
          const newTracks = new Map(state.tracks)
          newTracks.set(id, track)
          return { tracks: newTracks }
        })
        return id
      },
      
      removeTrack: (trackId) => {
        set((state) => {
          const newTracks = new Map(state.tracks)
          newTracks.delete(trackId)
          return { tracks: newTracks }
        })
      },
      
      reorderTracks: (trackIds) => {
        set((state) => {
          const newTracks = new Map<string, TimelineTrack>()
          trackIds.forEach((id) => {
            const track = state.tracks.get(id)
            if (track) newTracks.set(id, track)
          })
          state.tracks.forEach((track, id) => {
            if (!trackIds.includes(id)) {
              newTracks.set(id, track)
            }
          })
          return { tracks: newTracks }
        })
      },
      
      updateTrack: (trackId, updates) => {
        set((state) => {
          const track = state.tracks.get(trackId)
          if (!track) return state
          const newTracks = new Map(state.tracks)
          newTracks.set(trackId, { ...track, ...updates, updatedAt: Date.now() })
          return { tracks: newTracks }
        })
      },
      
      addClip: (trackId, _clipData) => {
        const id = generateId()
        set((state) => {
          const track = state.tracks.get(trackId)
          if (!track) return state
          const newTracks = new Map(state.tracks)
          newTracks.set(trackId, {
            ...track,
            clips: [...track.clips, id],
            updatedAt: Date.now(),
          })
          return { tracks: newTracks }
        })
        return id
      },
      
      removeClip: (clipId) => {
        set((state) => {
          const newTracks = new Map(state.tracks)
          let found = false
          newTracks.forEach((track, trackId) => {
            if (track.clips.includes(clipId)) {
              newTracks.set(trackId, {
                ...track,
                clips: track.clips.filter((id) => id !== clipId),
                updatedAt: Date.now(),
              })
              found = true
            }
          })
          if (!found) return state
          return { 
            tracks: newTracks,
            selectedClipIds: state.selectedClipIds.filter((id) => id !== clipId),
          }
        })
      },
      
      moveClip: (clipId, _newTimelineStartFrame, newTrackId) => {
        set((state) => {
          const newTracks = new Map(state.tracks)
          let moved = false
          let oldTrackId: string | null = null
          
          newTracks.forEach((track, trackId) => {
            if (track.clips.includes(clipId)) {
              oldTrackId = trackId
              newTracks.set(trackId, {
                ...track,
                clips: track.clips.filter((id) => id !== clipId),
                updatedAt: Date.now(),
              })
              moved = true
            }
          })
          
          if (!moved || !oldTrackId) return state
          
          const targetTrackId = newTrackId ?? oldTrackId
          const targetTrack = newTracks.get(targetTrackId)
          if (!targetTrack) return state
          
          newTracks.set(targetTrackId, {
            ...targetTrack,
            clips: [...targetTrack.clips, clipId],
            updatedAt: Date.now(),
          })
          
          return { tracks: newTracks }
        })
      },
      
      trimClip: (_clipId, _trimStartFrame, _trimEndFrame) => {
        set((state) => state)
      },
      
      splitClip: (clipId, _splitFrame) => {
        const newClipId = generateId()
        set((state) => {
          let foundTrack: TimelineTrack | null = null
          let foundTrackId: string | null = null
          
          state.tracks.forEach((track, trackId) => {
            if (track.clips.includes(clipId)) {
              foundTrack = track
              foundTrackId = trackId
            }
          })
          
          if (!foundTrack || !foundTrackId) return state
          
          const newTracks = new Map(state.tracks)
          newTracks.set(foundTrackId, {
            ...foundTrack as TimelineTrack,
            clips: [...(foundTrack as TimelineTrack).clips, newClipId],
            updatedAt: Date.now(),
          })
          
          return { tracks: newTracks }
        })
        return newClipId
      },
      
      duplicateClip: (clipId, _newTimelineStartFrame, newTrackId) => {
        const newClipId = generateId()
        set((state) => {
          let targetTrackId = newTrackId
          let targetTrack = state.tracks.get(targetTrackId ?? '')
          
          if (!targetTrack) {
            state.tracks.forEach((track, trackId) => {
              if (track.clips.includes(clipId)) {
                targetTrack = track
                targetTrackId = trackId
              }
            })
          }
          
          if (!targetTrack || !targetTrackId) return state
          
          const newTracks = new Map(state.tracks)
          newTracks.set(targetTrackId, {
            ...targetTrack,
            clips: [...targetTrack.clips, newClipId],
            updatedAt: Date.now(),
          })
          
          return { tracks: newTracks }
        })
        return newClipId
      },
      
      updateClipProperty: (_clipId, _property, _value) => {
        set((state) => state)
      },
      
      selectClip: (clipId, multi = false) => {
        set((state) => {
          if (multi) {
            if (state.selectedClipIds.includes(clipId)) {
              return { selectedClipIds: state.selectedClipIds.filter((id) => id !== clipId) }
            }
            return { selectedClipIds: [...state.selectedClipIds, clipId] }
          }
          return { selectedClipIds: [clipId] }
        })
      },
      
      clearSelection: () => set({ selectedClipIds: [] }),
      
      selectAllClips: () => {
        const allClips: string[] = []
        get().tracks.forEach((track) => {
          allClips.push(...track.clips)
        })
        set({ selectedClipIds: allClips })
      },
      
      undo: () => {
        getHistoryManager().undo()
      },
      
      redo: () => {
        getHistoryManager().redo()
      },
      
      canUndo: () => {
        return getHistoryManager().canUndo()
      },
      
      canRedo: () => {
        return getHistoryManager().canRedo()
      },
    }),
    {
      name: 'timeline-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fps: state.fps,
        currentFrame: state.currentFrame,
        zoom: state.zoom,
        tracks: Array.from(state.tracks.entries()),
        selectedClipIds: state.selectedClipIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.tracks)) {
          state.tracks = new Map(state.tracks as [string, TimelineTrack][])
        }
      },
    }
  )
)