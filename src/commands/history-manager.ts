import type { Command, BaseCommand } from './command'

export interface HistoryManager {
  push(command: Command): void
  undo(): Command | null
  redo(): Command | null
  canUndo(): boolean
  canRedo(): boolean
  clear(): void
  getHistory(): Command[]
  getFuture(): Command[]
  getMaxSize(): number
  setMaxSize(size: number): void
}

export class DefaultHistoryManager implements HistoryManager {
  private history: Command[] = []
  private future: Command[] = []
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  push(command: Command): void {
    this.history.push(command)
    this.future = []

    // Trim history if it exceeds max size
    if (this.history.length > this.maxSize) {
      this.history.shift()
    }
  }

  undo(): Command | null {
    if (!this.canUndo()) return null

    const command = this.history.pop()!
    this.future.push(command)
    void command.undo()
    return command
  }

  redo(): Command | null {
    if (!this.canRedo()) return null

    const command = this.future.pop()!
    this.history.push(command)
    void command.redo()
    return command
  }

  canUndo(): boolean {
    return this.history.length > 0
  }

  canRedo(): boolean {
    return this.future.length > 0
  }

  clear(): void {
    this.history = []
    this.future = []
  }

  getHistory(): Command[] {
    return [...this.history]
  }

  getFuture(): Command[] {
    return [...this.future]
  }

  getMaxSize(): number {
    return this.maxSize
  }

  setMaxSize(size: number): void {
    this.maxSize = size
    if (this.history.length > size) {
      this.history = this.history.slice(-size)
    }
  }
}

// Singleton instance
let historyManagerInstance: HistoryManager | null = null

export function getHistoryManager(): HistoryManager {
  historyManagerInstance ??= new DefaultHistoryManager()
  return historyManagerInstance
}

export function setHistoryManager(manager: HistoryManager): void {
  historyManagerInstance = manager
}

// Command registry for deserialization
export const commandRegistry = new Map<string, new (...args: unknown[]) => BaseCommand>()

export function registerCommand(
  type: string,
  constructor: new (...args: unknown[]) => BaseCommand
): void {
  commandRegistry.set(type, constructor)
}

export function deserializeCommand(json: string): BaseCommand | null {
  try {
    const payload = JSON.parse(json) as { type: string; payload: unknown }
    const Constructor = commandRegistry.get(payload.type)
    if (!Constructor) return null
    return new Constructor(payload)
  } catch {
    return null
  }
}

export type { Command } from './command'