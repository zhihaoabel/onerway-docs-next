import type { ParsedPath } from "../types";
import {
  CACHE_DEBOUNCE_DELAY,
  STORAGE_KEYS,
} from "../constants";
import { debounce } from "../utils";

export class CacheManager {
  private titleCache = new Map<string, string>();
  private descriptionCache = new Map<string, string>();
  private pathCache = new Map<string, ParsedPath>();

  private saveDebounced = debounce(() => {
    this.saveToDisk();
  }, CACHE_DEBOUNCE_DELAY);

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (!import.meta.client) return;

    try {
      const titleData = localStorage.getItem(
        STORAGE_KEYS.TITLE_CACHE
      );
      if (titleData) {
        this.titleCache = new Map(JSON.parse(titleData));
      }

      const descData = localStorage.getItem(
        STORAGE_KEYS.DESC_CACHE
      );
      if (descData) {
        this.descriptionCache = new Map(
          JSON.parse(descData)
        );
      }
    } catch (error) {
      console.warn("Failed to load caches:", error);
    }
  }

  private saveToDisk(): void {
    if (!import.meta.client) return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.TITLE_CACHE,
        JSON.stringify([...this.titleCache])
      );
      localStorage.setItem(
        STORAGE_KEYS.DESC_CACHE,
        JSON.stringify([...this.descriptionCache])
      );
    } catch (error) {
      console.warn("Failed to save caches:", error);
    }
  }

  getTitle(key: string): string | undefined {
    return this.titleCache.get(key);
  }

  setTitle(key: string, value: string): void {
    this.titleCache.set(key, value);
    this.saveDebounced();
  }

  getDescription(key: string): string | undefined {
    return this.descriptionCache.get(key);
  }

  setDescription(key: string, value: string): void {
    this.descriptionCache.set(key, value);
    this.saveDebounced();
  }

  getPath(key: string): ParsedPath | undefined {
    return this.pathCache.get(key);
  }

  setPath(key: string, value: ParsedPath): void {
    this.pathCache.set(key, value);
  }

  getDebugInfo(): Record<string, number> {
    return {
      titleCacheSize: this.titleCache.size,
      descriptionCacheSize: this.descriptionCache.size,
      pathCacheSize: this.pathCache.size,
    };
  }
}
