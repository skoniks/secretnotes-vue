import InputView from '@/views/InputView.vue';
import OutputView from '@/views/OutputView.vue';
import ResultView from '@/views/ResultView.vue';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const routes = {
  input: InputView,
  output: OutputView,
  result: ResultView
};

type Route = keyof typeof routes;

export const useRouteStore = defineStore('route', () => {
  const pathname = location.pathname.split('/').pop();
  const route = ref<Route>(pathname ? 'output' : 'input');
  const view = computed(() => routes[route.value]);
  const goto = (key: Route, url = '/') => {
    history.pushState({}, '', url);
    route.value = key;
  };
  return { route, view, goto };
});
