<script setup lang="ts">
import { decryptBlob, saveBlob } from '@/plugins/blob';
import { placeholder } from '@/plugins/const';
import { md5 } from '@/plugins/crypto';
import { useRouteStore } from '@/stores/route';
import { useSecretStore } from '@/stores/secret';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { goto } = useRouteStore();
const { error, loader, progress } = storeToRefs(useSecretStore());

const output = ref('');
const secret = ref('');
const image = ref(false);
const loaded = ref(false);
const secretEl = ref<HTMLInputElement>();
const inputEl = ref<HTMLTextAreaElement>();

onMounted(() => {
  if (secretEl.value) secretEl.value.focus();
});

async function onSubmit() {
  progress.value = 0;
  loader.value = true;
  const formdata = new FormData();
  const name = location.pathname.split('/').pop();
  formdata.append('id', name || '');
  formdata.append('secret', md5(secret.value));
  const request = new XMLHttpRequest();
  request.onprogress = (e) => {
    progress.value = Math.round((e.loaded / e.total) * 100);
    console.log('d', e.loaded, e.total, (e.loaded / e.total) * 100);
  };
  request.onload = async () => {
    console.log(request.status, request.response);
    if (request.status >= 200 && request.status < 300) {
      const blob = await decryptBlob(request.response, secret.value);
      if (blob.type === 'text/plain') {
        output.value = await blob.text();
        loaded.value = true;
        setTimeout(() => {
          if (!inputEl.value) return;
          inputEl.value.style.height = 'auto';
          inputEl.value.style.height = inputEl.value.scrollHeight + 'px';
        });
      } else if (blob.type.startsWith('image')) {
        const [type] = blob.type.split('+');
        const buffer = await blob.arrayBuffer();
        const data = new Blob([buffer], { type });
        output.value = URL.createObjectURL(data);
        image.value = true;
        loaded.value = true;
      } else {
        loaded.value = true;
        saveBlob(blob, name || 'file');
        goto('input');
      }
    } else error.value = true;
    loader.value = false;
  };
  request.onerror = () => {
    error.value = true;
    setTimeout(() => (loader.value = false), 500);
  };
  request.open('POST', import.meta.env.VITE_API_URL);
  request.responseType = 'blob';
  request.send(formdata);
}

function onImage() {
  window.open(output.value);
}
</script>

<template>
  <section>
    <img v-show="image" :src="output" @click="onImage" />
    <textarea
      rows="2"
      ref="inputEl"
      readonly="true"
      spellcheck="false"
      v-show="loaded && !image"
      :value="output"
    ></textarea>
    <input
      type="text"
      ref="secretEl"
      spellcheck="false"
      :placeholder="placeholder.split('').reverse().join('')"
      v-show="!loaded"
      v-model="secret"
    />
    <button v-show="!loaded" @click="onSubmit">
      {{ placeholder.slice(46, 60) }}
    </button>
    <button class="alt" @click="goto('input')">
      {{ placeholder.slice(74, 85) }}
    </button>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-flow: column;
  row-gap: 1em;
  > img {
    width: 100%;
    object-fit: contain;
    overflow: hidden;
    border: 1px solid #2688eb;
    border-radius: 0.5em;
    cursor: pointer;
  }
  > textarea {
    min-height: 4.5rem;
    max-height: 18em;
    resize: none;
    &:placeholder-shown {
      height: 4.5em !important;
      overflow: hidden;
      border-bottom: 0.8em solid var(--background-sec);
    }
  }
  > input[type='file'] {
    display: none;
  }
  > button {
    user-select: none;
  }
}
</style>
