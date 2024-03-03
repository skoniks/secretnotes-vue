<script setup lang="ts">
import { faCheck, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onBeforeMount, onMounted, ref } from 'vue';

const input = ref('');
const secret = ref('');
const expire = ref('259200');
const compact = ref(true);
const showIcon = ref(false);
const showInput = ref(false);

const placeholder =
  'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ';

onBeforeMount(() => {
  const start = localStorage.getItem('start');
  const visit = Date.now() - Number(start) < 60 * 60 * 1000;
  if (visit) showIcon.value = showInput.value = true;
  localStorage.setItem('start', Date.now().toString());
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
}
function encrypt() {}
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
          :placeholder="placeholder"
          :onInput="onInput"
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
        <button @click="encrypt">{{ placeholder.slice(46, 60) }}</button>
        <!-- <button class="outline">{{ placeholder.slice(46, 60) }}</button> -->
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
