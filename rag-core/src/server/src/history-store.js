class HistoryStore {
  cache = new Map();

  constructor({ maxSize = 10 } = {}) {
    this.maxSize = maxSize;
  }

  set(key = "", value) {
    if (this.size() === this.maxSize) {
      const oldestKey = [...this.cache.keys()].shift();

      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    return this.cache.get(key);
  }

  size() {
    return this.cache.size;
  }
}

const maxSize = 10;
const addToHistory = (history = [], message = "") => {
  const historyCopy = [...history];

  if (historyCopy.length > maxSize) {
    // ...
  }

  return historyCopy;
};
