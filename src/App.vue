<script setup lang="ts">
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref } from 'vue';

const input = ref('');
const height = ref('10em');
const showIcon = ref(false);
const showInput = ref(false);

const placeholder =
  'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ';

onMounted(() => {
  setTimeout(() => {
    showIcon.value = true;
    setTimeout(() => {
      showInput.value = true;
    }, 550);
  }, 50);
});

function onInput(e: Event) {
  if (e.target instanceof HTMLElement) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }
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
          :placeholder="placeholder"
          :onInput="onInput"
          v-model="input"
        ></textarea>
        <div class="group">
          <input
            type="text"
            :placeholder="placeholder.split('').reverse().join('')"
          />
          <select>
            <option value="">72 H</option>
            <option value="">24 H</option>
            <option value="">12 H</option>
            <option value="">60 M</option>
            <option value="">15 M</option>
          </select>
          <input type="checkbox" />
        </div>
        <button>Create Secret</button>
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
      > input[type='text'] {
        width: 100%;
      }
    }
  }
}

.expand-leave-active,
.expand-enter-active {
  transition: all 1s ease;
}

.expand-enter-to,
.expand-leave-from {
  max-height: v-bind(height);
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0px;
  transform: translateY(150px);
  opacity: 0;
}
</style>
