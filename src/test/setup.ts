import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock WebCodecs APIs
if (typeof global.VideoDecoder === 'undefined') {
  global.VideoDecoder = class MockVideoDecoder {
    state = 'unconfigured';
    decodeQueueSize = 0;
    constructor() {}
    configure() {}
    decode() {}
    flush() {}
    close() {}
    reset() {}
  } as any;
}

if (typeof global.VideoEncoder === 'undefined') {
  global.VideoEncoder = class MockVideoEncoder {
    state = 'unconfigured';
    encodeQueueSize = 0;
    constructor() {}
    configure() {}
    encode() {}
    flush() {}
    close() {}
  } as any;
}

if (typeof global.VideoFrame === 'undefined') {
  global.VideoFrame = class MockVideoFrame {
    timestamp = 0;
    duration = 0;
    format = 'I420';
    codedWidth = 1920;
    codedHeight = 1080;
    visibleRect = { x: 0, y: 0, width: 1920, height: 1080 };
    constructor() {}
    close() {}
    clone() {
      return new MockVideoFrame();
    }
  } as any;
}

if (typeof global.AudioDecoder === 'undefined') {
  global.AudioDecoder = class MockAudioDecoder {
    state = 'unconfigured';
    decodeQueueSize = 0;
    constructor() {}
    configure() {}
    decode() {}
    flush() {}
    close() {}
    reset() {}
  } as any;
}

if (typeof global.AudioEncoder === 'undefined') {
  global.AudioEncoder = class MockAudioEncoder {
    state = 'unconfigured';
    encodeQueueSize = 0;
    constructor() {}
    configure() {}
    encode() {}
    flush() {}
    close() {}
  } as any;
}

if (typeof global.AudioData === 'undefined') {
  global.AudioData = class MockAudioData {
    timestamp = 0;
    format = 'f32';
    sampleRate = 48000;
    numberOfFrames = 1024;
    numberOfChannels = 2;
    constructor() {}
    close() {}
    clone() {
      return new MockAudioData();
    }
  } as any;
}

// Mock WebAssembly
if (typeof global.WebAssembly === 'undefined') {
  global.WebAssembly = {
    instantiate: vi.fn(),
    instantiateStreaming: vi.fn(),
    compile: vi.fn(),
    compileStreaming: vi.fn(),
    Module: class {},
    Instance: class {},
    Memory: class {},
    Table: class {},
    Global: class {},
  } as any;
}

// Mock SharedArrayBuffer
if (typeof global.SharedArrayBuffer === 'undefined') {
  global.SharedArrayBuffer = class MockSharedArrayBuffer extends ArrayBuffer {} as any;
}

// Mock FFmpeg
vi.mock('@ffmpeg/ffmpeg', () => ({
  createFFmpeg: vi.fn(() => ({
    load: vi.fn(),
    run: vi.fn(),
    FS: vi.fn(),
    setLogger: vi.fn(),
  })),
  FetchProgress: vi.fn(),
  toBlobURL: vi.fn(),
}));

vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Suppress specific console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
