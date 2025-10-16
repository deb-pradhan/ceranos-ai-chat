/**
 * Polyfills for Web Crypto API and other modern browser features
 * This file should be imported before any other code to ensure polyfills are available
 */

// Polyfill for crypto.randomUUID() - RFC4122 version 4 UUID
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  console.log('[Polyfills] Adding crypto.randomUUID polyfill');
  
  // Ensure crypto.getRandomValues exists, if not provide a fallback
  if (!crypto.getRandomValues) {
    console.warn('[Polyfills] crypto.getRandomValues not available, using Math.random fallback');
    (crypto as any).getRandomValues = function<T extends ArrayBufferView>(array: T): T {
      const uint8Array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      for (let i = 0; i < uint8Array.length; i++) {
        uint8Array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }
  
  // Add randomUUID implementation
  (crypto as any).randomUUID = function randomUUID(): string {
    // Generate RFC4122 version 4 UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  console.log('[Polyfills] ✓ crypto.randomUUID polyfill installed');
}
