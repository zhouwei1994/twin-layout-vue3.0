import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import api from './api'
import elementUse from '@/plugins/element';
let app = createApp(App);
app.config.globalProperties.$api = api;
app.use(store);
elementUse(app);
app.mount('#app');
