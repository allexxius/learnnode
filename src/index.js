import './style.scss';
import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router'

import App from './App.vue';

import Modals from './pages/Modals.vue';
import ToDo from './pages/ToDo.vue';

const routes = [
    { path: '/', component: ToDo },
    { path: '/modals', component: Modals },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


const app = createApp(App);
app.use(router);
app.mount('#app');