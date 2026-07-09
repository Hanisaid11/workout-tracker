// Simple localStorage-backed persistence layer.
// Swap this file for a Dexie.js (IndexedDB) wrapper later if you need
// larger storage limits — keep the same loadKey/saveKey signatures
// and nothing else in the app needs to change.

const PREFIX = "workout-tracker:";

export async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("storage load failed", key, e);
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("storage save failed", key, e);
  }
}
