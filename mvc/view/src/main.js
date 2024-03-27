import { createApp } from 'vue'
import './styles/_index.sass'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from './components/login.vue';
import Onboarding from './components/onboarding.vue';
import Newticket from './components/new_ticket.vue';
import Tickets from './components/tickets.vue';
import Archive from './components/archive.vue';

const routes = [
    { path: '/', component: LoginComponent },
    { path: '/onboarding', component: Onboarding },
    { path: '/new_ticket', component: Newticket },
    { path: '/tickets', component: Tickets },
    { path: '/archive', component: Archive}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
