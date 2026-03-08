/**
 * Client-side AES-256-GCM encryption for dream content.
 * Keys are derived from a user-set passcode using PBKDF2.
 */

const ITERATIONS = 200_000;
const KEY_LENGTH = 256;
const SALT_KEY = "dc_salt";

async function deriveKey(passcode: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passcode),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

function getOrCreateSalt(): Uint8Array {
  if (typeof window === "undefined") return new Uint8Array(16);
  let stored = localStorage.getItem(SALT_KEY);
  if (!stored) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    stored = btoa(String.fromCharCode(...salt));
    localStorage.setItem(SALT_KEY, stored);
  }
  return Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
}

export async function encryptContent(plaintext: string, passcode: string): Promise<string> {
  const salt = getOrCreateSalt();
  const key = await deriveKey(passcode, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptContent(encryptedBase64: string, passcode: string): Promise<string> {
  const salt = getOrCreateSalt();
  const key = await deriveKey(passcode, salt);
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}
