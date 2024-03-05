<script setup lang="ts">
import { placeholder } from '@/plugins/const';
import { useRouteStore } from '@/stores/route';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref } from 'vue';

const { goto } = useRouteStore();

const input = ref('');
const secret = ref('');
const expire = ref('259200');
const compact = ref(true);

const fileEl = ref<HTMLInputElement>();
const inputEl = ref<HTMLTextAreaElement>();
const inputObs = new ResizeObserver(onResize);

onMounted(() => {
  inputObs.observe(inputEl.value!);
});

function onResize() {
  inputEl.value!.style.height = 'auto';
  inputEl.value!.style.height = inputEl.value!.scrollHeight + 'px';
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
  if (!e.dataTransfer!.files.length) return;
  fileEl.value!.files = e.dataTransfer!.files;
  e.preventDefault(), onChange();
}
function onPaste(e: ClipboardEvent) {
  if (!e.clipboardData!.files.length) return;
  fileEl.value!.files = e.clipboardData!.files;
  e.preventDefault(), onChange();
}
function onChange() {
  if (!fileEl.value?.files?.length) return;
  const [file] = fileEl.value.files;
  const size = (file.size / 1024 / 1024).toFixed(2);
  input.value = `📁: ${file.name} (${size} KB)`;
}
</script>

<template>
  <section>
    <textarea
      rows="2"
      ref="inputEl"
      autofocus="true"
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
    </div>
    <input type="file" ref="fileEl" @change="onChange" />
    <button @click="goto('output')">{{ placeholder.slice(46, 60) }}</button>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-flow: column;
  row-gap: 1em;
  > textarea {
    min-height: 4.5em;
    max-height: 18em;
    transition: height 1s ease;
    resize: none;
  }
  > div.group {
    display: flex;
    height: 3em;
    column-gap: 1em;
    > input {
      width: 100%;
    }
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
