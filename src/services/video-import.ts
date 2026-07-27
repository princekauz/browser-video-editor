// Video Import Service - Self-contained to avoid import issues

export interface MediaAsset {
  id: string
  type: 'video' | 'audio' | 'image' | 'text'
  file: File
  url: string
  metadata: {
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
  thumbnails: Map<number, string>
  waveform: Float32Array | null
  durationFrames: number
  createdAt: number
}

export interface ImportOptions {
  onProgress?: (progress: number, fileName: string) => void
  onComplete?: (result: { asset: any; file: File }) => void
  onError?: (error: Error, fileName: string) => void
}

export function detectMediaType(file: File): 'video' | 'audio' | 'image' | 'text' {
  const mimeType = file.type.toLowerCase()
  
  if (['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska'].includes(mimeType)) return 'video'
  if (['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/aac'].includes(mimeType)) return 'audio'
  if (['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'].includes(mimeType)) return 'image'
  
  // Fallback: check extension
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext || '')) return 'video'
  if (['mp3', 'wav', 'aac', 'ogg', 'm4a'].includes(ext || '')) return 'audio'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '')) return 'image'
  
  return 'text'
}

export async function extractMetadata(file: File, type: 'video' | 'audio' | 'image' | 'text'): Promise<{
  width: number
  height: number
  frameRate: number
  durationFrames: number
  codec?: string
  channels?: number
  sampleRate?: number
  bitrate?: number
  format?: string
}> {
  return new Promise((resolve, reject) => {
    if (type === 'video') {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          frameRate: 30,
          durationFrames: Math.round(video.duration * 30),
          format: file.type,
        })
        URL.revokeObjectURL(video.src)
      }
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video metadata'))
      }
      video.src = URL.createObjectURL(file)
    } else if (type === 'audio') {
      const audio = document.createElement('audio')
      audio.preload = 'metadata'
      audio.onloadedmetadata = () => {
        resolve({
          width: 0,
          height: 0,
          frameRate: 0,
          durationFrames: Math.round(audio.duration * 30),
          channels: 2,
          sampleRate: 44100,
          format: file.type,
        })
        URL.revokeObjectURL(audio.src)
      }
      audio.onerror = () => {
        URL.revokeObjectURL(audio.src)
        reject(new Error('Failed to load audio metadata'))
      }
      audio.src = URL.createObjectURL(file)
    } else if (type === 'image') {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          frameRate: 0,
          durationFrames: 0,
          format: file.type,
        })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        reject(new Error('Failed to load image metadata'))
      }
      img.src = URL.createObjectURL(file)
    } else {
      resolve({
        width: 0,
        height: 0,
        frameRate: 0,
        durationFrames: 0,
        format: file.type,
      })
    }
  })
}

export async function importFiles(files: File[], options: ImportOptions = {}): Promise<any[]> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file) continue
    
    try {
      const type = detectMediaType(file)
      const metadata = await extractMetadata(file, type)
      
      const asset = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: detectMediaType(file),
        file,
        url: URL.createObjectURL(file),
        metadata: {
          width: metadata.width,
          height: metadata.height,
          frameRate: metadata.frameRate,
          durationFrames: metadata.durationFrames,
          codec: metadata.codec,
          channels: metadata.channels,
          sampleRate: metadata.sampleRate,
          bitrate: metadata.bitrate,
          format: metadata.format,
        },
        thumbnails: new Map(),
        waveform: null,
        durationFrames: metadata.durationFrames,
        createdAt: Date.now(),
      }
      
      const result = { asset, file }
      options.onComplete?.(result)
    } catch (error) {
      options.onError?.(error as Error, file.name)
    }
  }
  
  return []
}

export async function importFromDataTransfer(dataTransfer: DataTransfer, options: ImportOptions = {}): Promise<any[]> {
  const files: File[] = []
  
  for (let i = 0; i < dataTransfer.items.length; i++) {
    const item = dataTransfer.items[i]
    if (item && item.kind === 'file') {
      const file = item.getAsFile()
      if (file) files.push(file)
    }
  }
  
  // Also check files directly (for older browsers)
  for (let i = 0; i < dataTransfer.files.length; i++) {
    const file = dataTransfer.files[i]
    if (file && !files.includes(file)) files.push(file)
  }
  
  return importFiles(files, options)
}

export function isSupportedFileType(file: File): boolean {
  return detectMediaType(file) !== 'text'
}

export function getSupportedExtensions(): Record<string, string[]> {
  return {
    video: ['mp4', 'mov', 'webm', 'avi', 'mkv'],
    audio: ['mp3', 'wav', 'aac', 'ogg', 'm4a'],
    image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'],
    text: [],
  }
}

export interface ImportOptions {
  onProgress?: (progress: number, fileName: string) => void
  onComplete?: (result: { asset: any; file: File }) => void
  onError?: (error: Error, fileName: string) => void
}