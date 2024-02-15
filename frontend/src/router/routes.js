
import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Signup from '../components/Authentication/Login.vue'
import Authentication from "./views/Authentication.vue";


const routes = [
  { name:"Home", path: '/', component: Home },
  { name:"Signup", path: '/signup', component: Signup },
  { name:"Authentication", path: '/authentication', component: Authentication },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
