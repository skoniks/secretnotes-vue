export const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set(key: string, value: any) {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  }
};
