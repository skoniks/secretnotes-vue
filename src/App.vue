<script setup lang="ts">
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref } from 'vue';

const input = ref('');
const showIcon = ref(false);
const showInput = ref(true);

const placeholder =
  'ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ᛬';

onMounted(() => {
  setTimeout(() => {
    showIcon.value = true;
    setTimeout(() => {
      showInput.value = true;
    }, 4550);
  }, 50);
});

function onInput(e: Event) {
  if (e.target instanceof HTMLElement) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 1 + 'px';
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
          :placeholder
          :onInput="onInput"
          v-model="input"
        ></textarea>
        <div class="group">
          <select>
            <option value="">1</option>
          </select>
          <select>
            <option value="">2</option>
          </select>
        </div>
        <button>foo</button>
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
      max-height: 18em;
      resize: none;
      &::placeholder {
        overflow: hidden;
        color: var(--text-sec);
        white-space: nowrap;
        text-overflow: ellipsis;
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
  max-height: 3em;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0px;
  transform: translateY(50px);
  opacity: 0;
}
</style>
