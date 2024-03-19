import { createApp } from 'vue'
import './styles/_index.sass'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from './components/login.vue';
import Onboarding from './components/onboarding.vue';

const routes = [
    { path: '/', component: LoginComponent },
    { path: '/onboarding', component: Onboarding }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
