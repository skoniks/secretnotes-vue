import '@fontsource/noto-sans';
import '@fontsource/noto-sans-runic';
import './assets/main.scss';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
