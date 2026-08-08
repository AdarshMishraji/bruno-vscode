import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, pick } from 'lodash';

export type RequestHistoryKind = 'http' | 'ws' | 'grpc';

export interface RequestHistoryEntry {
  id: string;
  timestamp: number;
  kind: RequestHistoryKind;
  method: string;
  url: string;
  itemUid: string;
  itemName: string;
  itemType: string;
  collectionUid: string;
  collectionPath: string;
  collectionName: string;
  environmentName?: string;
  status?: number;
  statusText?: string;
  duration?: number;
  size?: number;
  error?: string;
  item: Record<string, unknown>;
}

export type NewRequestHistoryEntry = Omit<RequestHistoryEntry, 'id' | 'timestamp'>;

const STORAGE_KEY = 'bruno.requestHistory';
const MAX_ENTRIES = 200;

let extensionContext: vscode.ExtensionContext | null = null;

export function setExtensionContext(context: vscode.ExtensionContext): void {
  extensionContext = context;
}

/**
 * Builds the sanitized item snapshot persisted with a history entry — just
 * enough to re-render the request pane (via the transient-request panel),
 * without the UI-only/transient fields (draft, response, requestState, etc.)
 * that live on the in-memory Redux item.
 *
 * Unsaved edits live under `item.draft` (a full clone of the item, taken the
 * moment the user starts editing — see `ensureDraft` in the webview's
 * collections slice) while `item.request` stays frozen at whatever was last
 * saved to disk. Since a request can be sent without ever being saved,
 * `item.draft` — when present — is the one that reflects what was actually
 * sent. Mirrors the same resolution already duplicated in `prepareItemRequest`
 * (ipc/network/index.ts), ws-event-handlers.ts, and grpc-event-handlers.ts.
 */
export function buildHistoryItemSnapshot(item: Record<string, unknown>): Record<string, unknown> {
  const draft = item.draft as Record<string, unknown> | null | undefined;
  const source = draft || item;
  return cloneDeep(pick(source, ['name', 'type', 'seq', 'tags', 'request', 'pathname']));
}

class RequestHistoryStore {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    if (!extensionContext) {
      return defaultValue;
    }
    return extensionContext.globalState.get<T>(key, defaultValue);
  }

  private setInStorage<T>(key: string, value: T): void {
    if (!extensionContext) {
      console.error('Extension context not set, cannot save request history');
      return;
    }
    extensionContext.globalState.update(key, value);
  }

  getEntries(): RequestHistoryEntry[] {
    return this.getFromStorage<RequestHistoryEntry[]>(STORAGE_KEY, []);
  }

  getEntry(id: string): RequestHistoryEntry | undefined {
    return this.getEntries().find((entry) => entry.id === id);
  }

  addEntry(data: NewRequestHistoryEntry): RequestHistoryEntry {
    const entry: RequestHistoryEntry = {
      ...data,
      id: uuidv4(),
      timestamp: Date.now()
    };

    const entries = [entry, ...this.getEntries()].slice(0, MAX_ENTRIES);
    this.setInStorage(STORAGE_KEY, entries);

    return entry;
  }

  updateEntry(id: string, patch: Partial<Omit<RequestHistoryEntry, 'id'>>): RequestHistoryEntry | undefined {
    const entries = this.getEntries();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return undefined;
    }

    const updated = { ...entries[index], ...patch };
    entries[index] = updated;
    this.setInStorage(STORAGE_KEY, entries);

    return updated;
  }

  removeEntry(id: string): void {
    const entries = this.getEntries().filter((entry) => entry.id !== id);
    this.setInStorage(STORAGE_KEY, entries);
  }

  clear(): void {
    this.setInStorage(STORAGE_KEY, []);
  }
}

export const requestHistoryStore = new RequestHistoryStore();
export { RequestHistoryStore };
