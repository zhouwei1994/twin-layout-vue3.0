import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import api from './api'
import Antd from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css';

let component = createApp(App);
component.config.globalProperties.$api = api;
component.use(store);
component.use(Antd);
component.mount('#app');
