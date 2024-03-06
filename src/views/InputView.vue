<script setup lang="ts">
import { encryptBlob } from '@/plugins/blob';
import { placeholder } from '@/plugins/const';
import { md5 } from '@/plugins/crypto';
import { useRouteStore } from '@/stores/route';
import { useSecretStore } from '@/stores/secret';
import { faCheck, faFileZipper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { goto } = useRouteStore();
const { expire, compact, loader, progress, result } =
  storeToRefs(useSecretStore());

const input = ref('');
const secret = ref('');
const fileEl = ref<HTMLInputElement>();
const inputEl = ref<HTMLTextAreaElement>();

onMounted(() => {
  if (inputEl.value) inputEl.value.focus();
});

function onResize() {
  if (!inputEl.value) return;
  inputEl.value.style.height = 'auto';
  inputEl.value.style.height = inputEl.value.scrollHeight + 'px';
}
function onInput(e: Event) {
  if (fileEl.value?.files?.length) {
    e.preventDefault();
    fileEl.value!.value = '';
    if (e instanceof InputEvent) {
      input.value = e.data || '';
    }
  }
  onResize();
}
function onDrop(e: DragEvent) {
  if (!fileEl.value || !e.dataTransfer?.files.length) return;
  fileEl.value.files = e.dataTransfer.files;
  e.preventDefault(), onChange();
}
function onPaste(e: ClipboardEvent) {
  if (!fileEl.value || !e.clipboardData?.files.length) return;
  fileEl.value.files = e.clipboardData.files;
  e.preventDefault(), onChange();
}
function onSelect() {
  fileEl.value!.click();
}
function onChange() {
  if (!fileEl.value?.files?.length) return;
  const [file] = fileEl.value.files;
  if (file.size > 128 * 1024 * 1024) {
    fileEl.value!.value = '';
    alert('📁 > 128 MB');
  } else {
    const size = (file.size / 1024 / 1024).toFixed(2);
    input.value = `📁: ${file.name} (${size} MB)`;
  }
}
async function onSubmit() {
  progress.value = 0;
  loader.value = true;
  const formdata = new FormData();
  if (fileEl.value?.files?.length) {
    const [file] = fileEl.value.files;
    const blob = await encryptBlob(file, secret.value);
    formdata.append('file', blob);
  } else if (input.value.length) {
    const file = new Blob([input.value], { type: 'plain/text' });
    const blob = await encryptBlob(file, secret.value);
    formdata.append('file', blob);
  } else {
    loader.value = false;
    return;
  }
  formdata.append('secret', md5(secret.value));
  formdata.append('expire', expire.value);
  formdata.append('compact', String(compact.value));
  const request = new XMLHttpRequest();
  request.upload.onprogress = (e) => {
    progress.value = Math.round((e.loaded / e.total) * 100);
    console.log('u', e.loaded, e.total, (e.loaded / e.total) * 100);
  };
  request.onprogress = (e) => {
    console.log('d', e.loaded, e.total, (e.loaded / e.total) * 100);
  };
  request.onload = () => {
    const response = JSON.parse(request.responseText);
    if (response.statusCode === 200) {
      setTimeout(() => {
        result.value = response.result;
        goto('result');
      }, 500);
    }
    setTimeout(() => (loader.value = false), 500);
  };
  request.onerror = () => {
    setTimeout(() => (loader.value = false), 500);
  };
  request.open('post', import.meta.env.VITE_API_URL);
  request.send(formdata);
}
</script>

<template>
  <section>
    <textarea
      rows="2"
      ref="inputEl"
      spellcheck="false"
      :placeholder="placeholder"
      @drop="onDrop"
      @paste="onPaste"
      @input="onInput"
      v-model="input"
    ></textarea>
    <div class="group">
      <input
        type="text"
        spellcheck="false"
        :placeholder="placeholder.split('').reverse().join('')"
        v-model="secret"
      />
      <select tabindex="-1" v-model="expire">
        <option value="259200">72 H</option>
        <option value="86400">24 H</option>
        <option value="43200">12 H</option>
        <option value="3600">60 M</option>
        <option value="300">15 M</option>
      </select>
      <label class="checkbox">
        <input type="checkbox" tabindex="-1" v-model="compact" />
        <span><FontAwesomeIcon :icon="faCheck" /></span>
      </label>
      <button class="alt" @click="onSelect">
        <FontAwesomeIcon :icon="faFileZipper" />
      </button>
    </div>
    <input type="file" ref="fileEl" @change="onChange" />
    <button @click="onSubmit">{{ placeholder.slice(46, 60) }}</button>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-flow: column;
  row-gap: 1em;
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
  > div.group {
    display: flex;
    height: 3em;
    column-gap: 1em;
    > input {
      width: 100%;
    }
    > button,
    > label.checkbox {
      flex: 0 0 3em;
      user-select: none;
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
