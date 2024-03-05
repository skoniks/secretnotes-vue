import '@fontsource/nunito';
import './assets/main.scss';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App2 from './App2.vue';

const app = createApp(App2);
app.use(createPinia());
app.mount('#app');
