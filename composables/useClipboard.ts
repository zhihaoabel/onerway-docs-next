import { readonly, ref } from "vue";

export interface ClipboardOptions {
  successTitle?: string;
  successDesc?: string;
  errorTitle?: string;
  errorDesc?: string;
  transform?: (text: string) => string;
  duration?: number;
  resetDelay?: number;
}

export interface ClipboardResult {
  copy: (
    text: string,
    options?: ClipboardOptions
  ) => Promise<boolean>;
  copied: Readonly<Ref<boolean>>;
  isSupported: Readonly<Ref<boolean>>;
}

/**
 * Composable for clipboard operations with toast notifications
 *
 * Features:
 * - Browser compatibility check
 * - Automatic success/error toast notifications
 * - Text transformation support
 * - Internationalization ready
 * - Customizable feedback messages
 *
 * @example
 * ```typescript
 * const { copy, copied } = useClipboard()
 *
 * // Basic usage
 * await copy('Hello World')
 *
 * // With custom messages
 * await copy('4242 4242 4242 4242', {
 *   successTitle: 'Card copied!',
 *   transform: (text) => text.replace(/\s/g, '')
 * })
 * ```
 */
export const useClipboard = (): ClipboardResult => {
  const { t } = useI18n();
  const toast = useToast();

  // Reactive state
  const copied = ref(false);
  const isSupported = ref(
    !!navigator?.clipboard?.writeText
  );

  /**
   * Copy text to clipboard with optional toast notifications
   *
   * @param text - Text to copy to clipboard
   * @param options - Configuration options for the copy operation
   * @returns Promise<boolean> - Returns true if copy was successful
   */
  const copy = async (
    text: string,
    options: ClipboardOptions = {}
  ): Promise<boolean> => {
    const {
      successTitle,
      successDesc,
      errorTitle,
      errorDesc,
      transform,
      duration = 3000,
      resetDelay = 2000
    } = options;

    // Check browser support
    if (!isSupported.value) {
      console.warn("Clipboard API not available");

      // Show error toast if error messages are provided
      if (errorTitle || errorDesc) {
        toast.add({
          title: errorTitle || t("common.error"),
          description:
            errorDesc || "Clipboard not supported",
          color: "error",
          icon: "i-heroicons-exclamation-triangle",
          duration
        });
      }

      return false;
    }

    try {
      // Apply text transformation if provided
      const textToCopy = transform ? transform(text) : text;

      // Copy to clipboard
      await navigator.clipboard.writeText(textToCopy);

      // Update state
      copied.value = true;

      // Show success toast if messages are provided
      if (successTitle || successDesc) {
        toast.add({
          title: successTitle || "Success",
          description:
            successDesc || "Text copied to clipboard",
          color: "success",
          icon: "i-heroicons-check-circle",
          duration
        });
      }

      // Reset copied state after delay
      setTimeout(() => {
        copied.value = false;
      }, resetDelay);

      return true;
    } catch (error) {
      console.error("Copy to clipboard failed:", error);

      // Show error toast if error messages are provided
      if (errorTitle || errorDesc) {
        toast.add({
          title: errorTitle || t("common.error"),
          description:
            errorDesc || "Failed to copy to clipboard",
          color: "error",
          icon: "i-heroicons-x-circle",
          duration
        });
      }

      return false;
    }
  };

  return {
    copy,
    copied: readonly(copied),
    isSupported: readonly(isSupported)
  };
};

// Types are already exported above, no need to re-export
