import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    path: '/manage',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
  },
  {
    path: '/manage-music',
    redirect: { name: 'manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  // check if the forward route require auth
  if (!to.matched.some(route => route.meta.requiresAuth)) return next()
  // check if user logged in
  if (store.state.userLoggedIn) next()
  else next({ name: 'home' })
})
export default router;
