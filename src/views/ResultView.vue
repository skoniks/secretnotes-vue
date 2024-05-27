<script setup lang="ts">
import { placeholder } from '@/plugins/const';
import { useRouteStore } from '@/stores/route';
import { useSecretStore } from '@/stores/secret';
import { faCheck, faCopy, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { toDataURL } from 'qrcode';
import { computed, onMounted, ref } from 'vue';

const { goto } = useRouteStore();
const { qrcode, result } = storeToRefs(useSecretStore());

const copy = ref(false);
const url = computed(() => `${location.origin}/${result.value}`);
const inputEl = ref<HTMLInputElement>();

onMounted(() => {
  toDataURL(url.value, {
    color: { dark: '#ffffff', light: '#1e232a' },
    width: 500,
    margin: 3
  }).then((data) => (qrcode.value = data));
});

function onCopy() {
  if (copy.value) return;
  navigator.clipboard.writeText(url.value);
  setTimeout(() => (copy.value = false), 2500);
  copy.value = true;
}

function onShare() {
  const title = 'Secret ' + result.value;
  navigator.share({ title, url: url.value });
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
        <TransitionGroup>
          <FontAwesomeIcon v-show="!copy" :icon="faCopy" :key="1" />
          <FontAwesomeIcon v-show="copy" :icon="faCheck" :key="2" />
        </TransitionGroup>
      </button>
      <button class="alt" @click="onShare">
        <FontAwesomeIcon :icon="faShare" />
      </button>
    </div>
    <button class="alt" @click="goto('input')">
      {{ placeholder.slice(46, 60) }}
    </button>
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
      position: relative;
      > svg {
        position: absolute;
        inset: 1em;
      }
    }
  }
  > button {
    user-select: none;
  }
}
</style>
