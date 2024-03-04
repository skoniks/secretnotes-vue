<script setup lang="ts">
import { faCheck, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { encryptBlob, md5 } from './plugins/crypto';

const input = ref('');
const secret = ref('');
const expire = ref('259200');
const compact = ref(true);
const showIcon = ref(false);
const showInput = ref(false);
const inputFile = ref<HTMLInputElement>();

const placeholder =
  'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ';

watch([expire, compact], () => {
  const options = { expire: expire.value, compact: compact.value };
  localStorage.setItem('options', JSON.stringify(options));
});

onBeforeMount(() => {
  const start = localStorage.getItem('start');
  const visit = Date.now() - Number(start) < 60 * 60 * 1000;
  if (visit) showIcon.value = showInput.value = true;
  localStorage.setItem('start', Date.now().toString());
  const options = localStorage.getItem('options');
  if (options && typeof options === 'string') {
    const parsed = JSON.parse(options);
    expire.value = parsed.expire;
    compact.value = parsed.compact;
  }
});

onMounted(() => {
  setTimeout(() => {
    showIcon.value = true;
    setTimeout(() => {
      showInput.value = true;
    }, 500);
  }, 50);
});

function onInput(e: Event) {
  if (e.target instanceof HTMLElement) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }
  if (inputFile.value?.files?.length) {
    inputFile.value.value = '';
    if (e instanceof InputEvent) {
      input.value = e.data || '';
    }
  }
}
function onDrop(e: DragEvent) {
  if (!inputFile.value || !e.dataTransfer) return;
  inputFile.value.files = e.dataTransfer.files;
  e.preventDefault(), onChange();
}
function onPaste(e: ClipboardEvent) {
  if (!inputFile.value || !e.clipboardData) return;
  inputFile.value.files = e.clipboardData.files;
  e.preventDefault(), onChange();
}
function onChange() {
  if (!inputFile.value?.files) return;
  const [file] = inputFile.value.files;
  if (file) input.value = file.name;
}
async function onUpload() {
  const formdata = new FormData();
  if (inputFile.value?.files?.length) {
    const [file] = inputFile.value.files;
    const blob = await encryptBlob(file, secret.value);
    formdata.append('file', blob);
  } else if (input.value.length) {
    const file = new Blob([input.value], { type: 'plain/text' });
    const blob = await encryptBlob(file, secret.value);
    formdata.append('file', blob);
  } else return;
  formdata.append('secret', md5(secret.value));
  formdata.append('compact', String(compact.value));
  formdata.append('expire', expire.value);
  // console.log([...formdata.values()]);
  const request = new XMLHttpRequest();
  request.upload.onprogress = (e) => {
    console.log(e.loaded, e.total, (e.loaded / e.total) * 100);
  };
  request.onprogress = (e) => {
    console.log(e.loaded, e.total, (e.loaded / e.total) * 100);
  };
  request.onload = () => {
    console.log(request.responseText);
  };
  request.open('post', 'http://localhost:3000/');
  request.send(formdata);
}
</script>

<template>
  <main>
    <section class="icon" :class="{ show: showIcon }">
      <FontAwesomeIcon :icon="faUserSecret" />
      <div class="preload"></div>
    </section>
    <Transition name="expand">
      <section class="input" v-show="showInput">
        <div></div>
        <textarea
          :rows="1"
          :spellcheck="false"
          :placeholder
          :onDrop
          :onPaste
          :onInput
          v-model="input"
        ></textarea>
        <div class="group">
          <input
            type="text"
            :spellcheck="false"
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
            <input type="checkbox" v-model="compact" />
            <span><FontAwesomeIcon :icon="faCheck" /></span>
          </label>
        </div>
        <input type="file" ref="inputFile" :onChange />
        <button @click="onUpload">{{ placeholder.slice(46, 60) }}</button>
      </section>
    </Transition>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  > section.icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 125px;
    height: 125px;
    overflow: hidden;
    > svg {
      width: 100%;
      height: 100%;
    }
    > div.preload {
      position: absolute;
      width: 200%;
      height: 200%;
      border-radius: 50%;
      box-shadow: inset 0 0 0 125px var(--background);
      transition: box-shadow 1s ease;
    }
    &.show > div.preload {
      box-shadow: inset 0 0 0 0 var(--background);
    }
  }
  > section.input {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
    justify-content: center;
    width: 100vw;
    max-width: 30em;
    padding: 0 1em;
    > * {
      width: 100%;
    }
    > textarea {
      min-height: 3em;
      max-height: 18em;
      resize: none;
    }
    > div.group {
      display: flex;
      gap: 1em;
      > input {
        width: 100%;
      }
      > label.checkbox {
        flex: 0 0 3em;
      }
    }
    // > input[type='file'] {
    //   display: none;
    // }
    > button {
      user-select: none;
    }
  }
}

.expand-leave-active,
.expand-enter-active {
  transition: all 1s ease;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 12em;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0px;
  transform: translateY(12em);
  opacity: 0;
}
</style>
