import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Inline types
type MediaType = 'video' | 'audio' | 'image' | 'text'

interface MediaMetadata {
  width: number
  height: number
  frameRate: number
  durationFrames: number
  codec?: string
  channels?: number
  sampleRate?: number
  bitrate?: number
  format?: string
}

interface MediaAsset {
  id: string
  type: MediaType
  file: File | null
  url: string
  metadata: MediaMetadata
  thumbnails: Map<number, string>
  waveform: Float32Array | null
  durationFrames: number
  createdAt: number
}

interface MediaStore {
  assets: Map<string, MediaAsset>
  thumbnails: Map<string, Map<number, string>>
  waveforms: Map<string, Float32Array>
  
  addAsset: (asset: MediaAsset) => void
  removeAsset: (assetId: string) => void
  getAsset: (assetId: string) => MediaAsset | undefined
  getAllAssets: () => MediaAsset[]
  getAssetsByType: (type: MediaType) => MediaAsset[]
  
  setThumbnail: (assetId: string, frame: number, dataUrl: string) => void
  getThumbnail: (assetId: string, frame: number) => string | undefined
  getThumbnails: (assetId: string) => Map<number, string> | undefined
  
  setWaveform: (assetId: string, waveform: Float32Array) => void
  getWaveform: (assetId: string) => Float32Array | undefined
  
  clearCache: (assetId?: string) => void
}

export const useMediaStore = create<MediaStore>()(
  persist(
    (set, get) => ({
      assets: new Map(),
      thumbnails: new Map(),
      waveforms: new Map(),
      
      addAsset: (asset) => set((state) => {
        const newAssets = new Map(state.assets)
        newAssets.set(asset.id, asset)
        return { assets: newAssets }
      }),
      
      removeAsset: (assetId) => set((state) => {
        const newAssets = new Map(state.assets)
        newAssets.delete(assetId)
        const newThumbnails = new Map(state.thumbnails)
        newThumbnails.delete(assetId)
        const newWaveforms = new Map(state.waveforms)
        newWaveforms.delete(assetId)
        return { assets: newAssets, thumbnails: newThumbnails, waveforms: newWaveforms }
      }),
      
      getAsset: (assetId) => get().assets.get(assetId),
      getAllAssets: () => Array.from(get().assets.values()),
      getAssetsByType: (type) => Array.from(get().assets.values()).filter(a => a.type === type),
      
      setThumbnail: (assetId, frame, dataUrl) => set((state) => {
        const newThumbnails = new Map(state.thumbnails)
        let assetThumbs = newThumbnails.get(assetId)
        if (!assetThumbs) {
          assetThumbs = new Map()
          newThumbnails.set(assetId, assetThumbs)
        }
        assetThumbs.set(frame, dataUrl)
        return { thumbnails: newThumbnails }
      }),
      
      getThumbnail: (assetId, frame) => get().thumbnails.get(assetId)?.get(frame),
      getThumbnails: (assetId) => get().thumbnails.get(assetId),
      
      setWaveform: (assetId, waveform) => set((state) => {
        const newWaveforms = new Map(state.waveforms)
        newWaveforms.set(assetId, waveform)
        return { waveforms: newWaveforms }
      }),
      
      getWaveform: (assetId) => get().waveforms.get(assetId),
      
      clearCache: (assetId) => set((state) => {
        if (assetId) {
          const newThumbnails = new Map(state.thumbnails)
          newThumbnails.delete(assetId)
          const newWaveforms = new Map(state.waveforms)
          newWaveforms.delete(assetId)
          return { thumbnails: newThumbnails, waveforms: newWaveforms }
        }
        return { thumbnails: new Map(), waveforms: new Map() }
      }),
    }),
    {
      name: 'media-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        assets: Array.from(state.assets.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.assets)) {
          state.assets = new Map(state.assets as [string, MediaAsset][])
        }
      },
    }
  )
)