import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: '首页',
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: '关于',
    }
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: {
      title: '404 Not Found',
    },
  },
]

export default () => createRouter({
  history: import.meta.env.SSR === false ? createWebHistory() : createMemoryHistory(),
  routes,
})