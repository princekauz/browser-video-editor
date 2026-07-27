import type { CommandType } from '../types';

export interface Command {
  execute(): void | Promise<void>;
  undo(): void | Promise<void>;
  redo(): void | Promise<void>;
  getType(): CommandType;
  getPayload(): unknown;
  getTimestamp(): number;
  getAffectedClipIds(): string[];
}

export abstract class BaseCommand implements Command {
  protected timestamp: number;
  protected affectedClipIds: string[];
  protected executed = false;

  constructor(affectedClipIds: string[] = []) {
    this.timestamp = Date.now();
    this.affectedClipIds = affectedClipIds;
  }

  abstract execute(): void | Promise<void>;
  abstract undo(): void | Promise<void>;
  abstract redo(): void | Promise<void>;
  abstract getType(): CommandType;
  abstract getPayload(): unknown;

  getTimestamp(): number {
    return this.timestamp;
  }

  getAffectedClipIds(): string[] {
    return this.affectedClipIds;
  }

  isExecuted(): boolean {
    return this.executed;
  }

  protected markExecuted(): void {
    this.executed = true;
  }

  protected markUnExecuted(): void {
    this.executed = false;
  }
}

// Command factory for creating commands from history
export interface CommandFactory {
  createCommand(type: CommandType, payload: unknown): Command;
}

export class UnknownCommandError extends Error {
  constructor(type: CommandType) {
    super(`Unknown command type: ${type}`);
    this.name = 'UnknownCommandError';
  }
}
