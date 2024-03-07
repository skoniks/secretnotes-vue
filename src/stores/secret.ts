import { storage } from '@/plugins/storage';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

type Secret = { time: number; expire: string; compact: boolean };
const defaults: Secret = { time: 0, expire: '259200', compact: true };

export const useSecretStore = defineStore('secret', () => {
  const cache = storage.get<Secret>('secret') || defaults;

  const time = ref(cache.time);
  const expire = ref(cache.expire);
  const compact = ref(cache.compact);

  let errorTimer: NodeJS.Timeout;
  const error = ref(false);
  const loader = ref(false);
  const progress = ref(0);
  const result = ref('');
  const qrcode = ref('');

  watch([expire, compact], updateCache);
  watch(error, (value) => {
    if (!value) return;
    clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
      error.value = false;
    }, 1000);
  });
  updateCache();

  function updateCache() {
    storage.set('secret', {
      time: Date.now(),
      expire: expire.value,
      compact: compact.value
    });
  }
  return { time, expire, compact, error, loader, progress, result, qrcode };
});
