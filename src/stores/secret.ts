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

  const loader = ref(false);
  const progress = ref(0);
  const result = ref('');
  const qrcode = ref('');

  watch([expire, compact], updateCache);
  updateCache();

  function updateCache() {
    storage.set('secret', {
      time: Date.now(),
      expire: expire.value,
      compact: compact.value
    });
  }
  return { time, expire, compact, loader, progress, result, qrcode };
});
