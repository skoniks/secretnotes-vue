<script setup lang="ts">
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRouteStore } from './stores/route';

const routeStore = useRouteStore();

const preload = ref(true);
const header = reactive({ offset: '0', stop: false });
const headerStyle = computed(() => ({
  transform: `translateY(calc(${header.offset}))`,
  transition: header.stop ? 'none' : 'transform 1s ease'
}));
const main = ref(false);
const mainEl = ref<HTMLElement>();
const mainObs = new ResizeObserver(onResize);

onBeforeMount(() => {
  preload.value = false;
  header.stop = true;
  main.value = true;
});

onMounted(() => {
  if (main.value) onResize();
  setTimeout(() => (preload.value = false), 50);
  setTimeout(() => {
    header.stop = false;
    mainObs.observe(mainEl.value!);
    main.value = true;
  }, 550);
});

function onResize() {
  const { offsetHeight = 0 } = mainEl.value!;
  header.offset = `-50% - ${offsetHeight / 2}px - 1em`;
}
</script>

<template>
  <header :style="headerStyle">
    <FontAwesomeIcon :icon="faUserSecret" />
    <div class="preload" :class="{ hide: !preload }"></div>
    <div class="qrcode"><img :src="''" /></div>
  </header>
  <main ref="mainEl" :class="{ hide: !main }">
    <Transition name="route">
      <component :is="routeStore.view"></component>
    </Transition>
  </main>
</template>

<style scoped lang="scss">
header {
  $icon-size: 125px;
  position: absolute;
  width: $icon-size;
  height: $icon-size;
  overflow: hidden;
  > svg {
    width: 100%;
    height: 100%;
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
  width: 100vw;
  max-width: 30em;
  padding: 0 1em;
  transition: opacity 0.5s ease;
  &.hide {
    opacity: 0;
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
  transform: translateY(-50%);
}
</style>
