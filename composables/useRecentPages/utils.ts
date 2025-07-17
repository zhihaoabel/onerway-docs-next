/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PathWarning } from "./types";

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function getLocalizedText(
  textMap: Record<string, string>,
  locale: string
): string {
  return (
    textMap[locale] ||
    textMap.en ||
    Object.values(textMap)[0] ||
    ""
  );
}

export function cleanTitle(title: string): string {
  return title
    .replace(
      /\s*[-|]\s*(Onerway|Documentation|Docs).*$/i,
      ""
    )
    .replace(/\s*[-|]\s*Nuxt.*$/i, "")
    .trim();
}

export function logPathWarning(warning: PathWarning): void {
  if (import.meta.dev) {
    console.warn(`[useRecentPages] ${warning.type}:`, {
      path: warning.path,
      message: warning.message,
      suggestions: warning.suggestions,
    });
  }
}
