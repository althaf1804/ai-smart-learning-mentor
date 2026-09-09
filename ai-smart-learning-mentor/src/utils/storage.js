// src/utils/storage.js
// Centralized LocalStorage "database" layer for the app.
// All reads/writes to LocalStorage should go through these helpers
// so that JSON parsing/stringifying is always handled safely and the
// app never crashes because of missing or corrupted data.

export const STORAGE_KEYS = {
  STUDENT_PROFILE: 'studentProfile',
  QUIZ_RESULTS: 'quizResults',
  TOPIC_PERFORMANCE: 'topicPerformance',
  COMPLETED_TOPICS: 'completedTopics',
  STUDY_PLAN: 'studyPlan',
  RECENT_DOUBTS: 'recentDoubts',
  RECOMMENDATIONS: 'recommendations',
  LEARNING_PROGRESS: 'learningProgress',
};

/**
 * Save data to LocalStorage safely.
 * @param {string} key
 * @param {*} data
 */
export function saveData(key, data) {
  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[storage] Failed to save data for key "${key}":`, error);
    return false;
  }
}

/**
 * Get data from LocalStorage safely, returning a default value
 * if the key doesn't exist or the data is corrupted.
 * @param {string} key
 * @param {*} defaultValue
 */
export function getData(key, defaultValue = null) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[storage] Failed to read data for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Remove a single key from LocalStorage.
 * @param {string} key
 */
export function removeData(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storage] Failed to remove key "${key}":`, error);
    return false;
  }
}

/**
 * Clear ALL app data from LocalStorage (only known keys).
 */
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('[storage] Failed to clear all data:', error);
    return false;
  }
}

/**
 * Append an item to an array stored under a given key.
 * Creates the array if it doesn't exist yet.
 */
export function appendToList(key, item, maxLength = null) {
  const list = getData(key, []);
  const updated = Array.isArray(list) ? [...list, item] : [item];
  const finalList =
    maxLength && updated.length > maxLength
      ? updated.slice(updated.length - maxLength)
      : updated;
  saveData(key, finalList);
  return finalList;
}
