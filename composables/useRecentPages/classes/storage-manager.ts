import type { RecentPage } from "../types";
import {
  MAX_RECENT_PAGES,
  STORAGE_KEYS
} from "../constants";
import { debounce } from "../utils";

export class StorageManager {
  private saveDebounced = debounce(() => {
    this.saveToDisk();
  }, 300);

  private pages: RecentPage[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (!import.meta.client) return;

    try {
      const stored = localStorage.getItem(
        STORAGE_KEYS.RECENT_PAGES
      );
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        this.pages = parsed.filter(
          (page) =>
            page &&
            typeof page === "object" &&
            page.path &&
            page.title &&
            page.timestamp
        );
      }
    } catch (error) {
      console.warn("Failed to load recent pages:", error);
      localStorage.removeItem(STORAGE_KEYS.RECENT_PAGES);
    }
  }

  private saveToDisk(): void {
    if (!import.meta.client) return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.RECENT_PAGES,
        JSON.stringify(this.pages)
      );
    } catch (error) {
      console.warn("Failed to save recent pages:", error);
    }
  }

  getPages(): RecentPage[] {
    return this.pages;
  }

  addPage(page: RecentPage): void {
    this.pages = [
      page,
      ...this.pages.filter((p) => p.path !== page.path)
    ].slice(0, MAX_RECENT_PAGES);

    this.saveDebounced();
  }

  removePage(path: string): void {
    this.pages = this.pages.filter(
      (page) => page.path !== path
    );
    this.saveDebounced();
  }

  clearPages(): void {
    this.pages = [];
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.RECENT_PAGES);
    }
  }
}
