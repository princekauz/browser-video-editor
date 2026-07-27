import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
  theme: 'dark' | 'light' | 'system'
  timelineFps: number
  autosaveInterval: number
  exportDefaults: {
    format: string
    resolution: { width: number; height: number }
    fps: number
    bitrate: number
    codec: string
    quality: string
    filename: string
  }
  keyboardShortcuts: Record<string, string>
  thumbnailInterval: number
  waveformEnabled: boolean
  hardwareAcceleration: boolean
  
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setTimelineFps: (fps: number) => void
  setAutosaveInterval: (interval: number) => void
  updateExportDefaults: (defaults: Partial<SettingsState['exportDefaults']>) => void
  setKeyboardShortcut: (action: string, shortcut: string) => void
  removeKeyboardShortcut: (action: string) => void
  setThumbnailInterval: (interval: number) => void
  setWaveformEnabled: (enabled: boolean) => void
  setHardwareAcceleration: (enabled: boolean) => void
  resetToDefaults: () => void
}

const DEFAULT_SHORTCUTS: Record<string, string> = {
  'play-pause': 'Space',
  'delete-clip': 'Delete',
  'undo': 'Control+Z',
  'redo': 'Control+Shift+Z',
  'copy': 'Control+C',
  'paste': 'Control+V',
  'split': 'S',
  'previous-frame': 'ArrowLeft',
  'next-frame': 'ArrowRight',
  'seek-backward': 'Shift+ArrowLeft',
  'seek-forward': 'Shift+ArrowRight',
  'go-to-start': 'Home',
  'go-to-end': 'End',
  'zoom-in': 'Control+=',
  'zoom-out': 'Control+-',
  'fit-timeline': 'Control+0',
  'select-all': 'Control+A',
  'duplicate': 'Control+D',
  'set-in-point': '[',
  'set-out-point': ']',
  'clear-points': 'Control+\\',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      timelineFps: 30,
      autosaveInterval: 5000,
      exportDefaults: {
        format: 'mp4',
        resolution: { width: 1920, height: 1080 },
        fps: 30,
        bitrate: 10000000,
        codec: 'h264',
        quality: 'high',
        filename: 'export',
      },
      keyboardShortcuts: { ...DEFAULT_SHORTCUTS },
      thumbnailInterval: 30,
      waveformEnabled: true,
      hardwareAcceleration: true,
      
      setTheme: (theme) => set({ theme }),
      setTimelineFps: (fps) => set({ timelineFps: fps }),
      setAutosaveInterval: (interval) => set({ autosaveInterval: interval }),
      updateExportDefaults: (defaults) => set((state) => ({
        exportDefaults: { ...state.exportDefaults, ...defaults },
      })),
      setKeyboardShortcut: (action, shortcut) => set((state) => ({
        keyboardShortcuts: { ...state.keyboardShortcuts, [action]: shortcut },
      })),
      removeKeyboardShortcut: (action) => set((state) => {
        const newShortcuts = { ...state.keyboardShortcuts }
        delete newShortcuts[action]
        return { keyboardShortcuts: newShortcuts }
      }),
      setThumbnailInterval: (interval) => set({ thumbnailInterval: interval }),
      setWaveformEnabled: (enabled) => set({ waveformEnabled: enabled }),
      setHardwareAcceleration: (enabled) => set({ hardwareAcceleration: enabled }),
      resetToDefaults: () => set({
        theme: 'system',
        timelineFps: 30,
        autosaveInterval: 5000,
        exportDefaults: {
          format: 'mp4',
          resolution: { width: 1920, height: 1080 },
          fps: 30,
          bitrate: 10000000,
          codec: 'h264',
          quality: 'high',
          filename: 'export',
        },
        keyboardShortcuts: { ...DEFAULT_SHORTCUTS },
        thumbnailInterval: 30,
        waveformEnabled: true,
        hardwareAcceleration: true,
      }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)