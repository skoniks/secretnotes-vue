<script setup lang="ts">
import { faCircleNotch, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRouteStore } from './stores/route';
import { useSecretStore } from './stores/secret';

const routeStore = useRouteStore();
const secretStore = useSecretStore();

const preload = ref(true);
const animate = ref(true);
const headerY = ref('0');
const headerT = computed(() => `translateY(calc(${headerY.value}))`);
const main = ref(false);
const mainEl = ref<HTMLElement>();
const mainObs = new ResizeObserver(onResize);

onBeforeMount(() => {
  if (secretStore.time > Date.now() - 60000) {
    preload.value = false;
    animate.value = false;
    main.value = true;
  }
});

onMounted(() => {
  mainObs.observe(mainEl.value!);
  setTimeout(() => (preload.value = false), 50);
  setTimeout(() => ((main.value = true), onResize()), 550);
  setTimeout(() => (animate.value = false), 1550);
});

function onResize() {
  if (!main.value || !mainEl.value) return;
  const { offsetHeight = 0 } = mainEl.value;
  headerY.value = `-${offsetHeight / 2}px`;
}
</script>

<template>
  <header :class="{ animate }" :style="{ transform: headerT }">
    <Transition>
      <div class="error" v-show="secretStore.error"></div>
    </Transition>
    <FontAwesomeIcon :icon="faUserSecret" />
    <div class="preload" :class="{ hide: !preload }"></div>
    <Transition>
      <div class="qrcode" v-show="routeStore.route == 'result'">
        <img :src="secretStore.qrcode" />
      </div>
    </Transition>
  </header>
  <main ref="mainEl" :class="{ hide: !main, animate }">
    <Transition name="route">
      <component :is="routeStore.view"></component>
    </Transition>
    <Transition>
      <div class="loader" v-show="secretStore.loader">
        <div class="progress">
          <FontAwesomeIcon :icon="faCircleNotch" :spin="true" />
          <span>{{ secretStore.progress }}%</span>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped lang="scss">
$icon-size: 150px;
header {
  position: absolute;
  z-index: 1;
  width: $icon-size;
  height: $icon-size;
  overflow: hidden;
  &.animate {
    transition: transform 1s ease;
  }
  > svg {
    position: relative;
    width: 95%;
    height: 95%;
    padding: 2.5%;
  }
  > div.error {
    position: absolute;
    top: 45px;
    left: 45px;
    width: 60px;
    height: 30px;
    background-color: #d92403;
  }
  > div.preload {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    box-shadow: inset 0 0 0 $icon-size var(--background);
    transition: box-shadow 1s ease;
    pointer-events: none;
    &.hide {
      box-shadow: inset 0 0 0 0 var(--background);
    }
  }
  > div.qrcode {
    position: absolute;
    inset: 0;
    > img {
      width: 100%;
      height: 100%;
      &[src=''] {
        display: none;
      }
    }
  }
}

main {
  position: relative;
  width: 100vw;
  max-width: 30em;
  padding: 1em;
  transform: translateY(calc($icon-size / 2));
  transition:
    transform 1s ease,
    opacity 1s ease;
  &.hide {
    transform: translateY(150%);
    opacity: 0;
  }
  > div.loader {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    inset: 0;
    > div.progress {
      padding: 0.8em;
      background-color: rgba(#2688eb, 0.1);
      border: 1px solid #2688eb;
      border-radius: 0.5em;
      > span {
        margin-left: 0.5em;
      }
    }
  }
}

.route-enter-active,
.route-leave-active {
  transition: opacity 0.5s ease;
}
.route-enter-from,
.route-leave-to {
  opacity: 0;
}
.route-leave-active {
  position: absolute;
  top: 50%;
  width: calc(100% - 2em);
  transform: translateY(-50%);
}
</style>
