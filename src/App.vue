<script setup lang="ts">
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const text = ref('');
</script>

<template>
  <main>
    <section class="icon">
      <FontAwesomeIcon :icon="faUserSecret" />
      <div class="preload"></div>
    </section>
    <section class="input">
      <p>{{ text }}</p>
    </section>
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
    width: 200px;
    height: 200px;
    // height: auto;
    > svg {
      width: 125px;
      height: 125px;
    }
    > div.preload {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: box-shadow 1s;
      @keyframes box-shadow {
        0% {
          box-shadow: inset 0 0 0 100px var(--background);
        }
        100% {
          box-shadow: inset 0 0 0 0 var(--background);
        }
      }
    }
  }
}
</style>
