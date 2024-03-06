<script setup lang="ts">
import { placeholder } from '@/plugins/const';
import { useRouteStore } from '@/stores/route';
import { useSecretStore } from '@/stores/secret';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { toDataURL } from 'qrcode';
import { computed, onMounted, ref } from 'vue';

const { goto } = useRouteStore();
const { qrcode, result } = storeToRefs(useSecretStore());
const url = computed(() => `${location.origin}#${result.value}`);
const inputEl = ref<HTMLInputElement>();

onMounted(() => {
  toDataURL(url.value, {
    color: { dark: '#ffffff', light: '#1e232a' },
    width: 500,
    margin: 3
  }).then((data) => (qrcode.value = data));
});

function onCopy() {
  if (inputEl.value) inputEl.value.select();
  navigator.clipboard.writeText(url.value);
}
</script>

<template>
  <section>
    <div class="group">
      <input
        type="text"
        spellcheck="false"
        readonly="true"
        ref="inputEl"
        :value="url"
      />
      <button class="alt" @click="onCopy">
        <FontAwesomeIcon :icon="faCopy" />
      </button>
    </div>
    <button @click="goto('input')">{{ placeholder.slice(46, 60) }}</button>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-flow: column;
  row-gap: 1em;
  > div.group {
    display: flex;
    height: 3em;
    column-gap: 1em;
    > input {
      width: 100%;
    }
    > button {
      flex: 0 0 3em;
      user-select: none;
    }
  }
  > button {
    user-select: none;
  }
}
</style>
