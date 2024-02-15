import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index';
import router from './router/routes'
import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes
import 'vue-toast-notification/dist/theme-sugar.css';
// import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ToastPlugin);
app.mount('#app');
