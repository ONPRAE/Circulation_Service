import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/LoginView.vue') } // หน้า Login
      ]
    },
    {
      path: '/user',
      component: () => import('../Layouts/UserLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/UserView.vue') } // หน้า HomeUser
      ]
    },
    {
      path: '/home',
      component: () => import('../Layouts/DrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/HomeView.vue') } // หน้า Home
      ]
    },
    {
      path: '/signup',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/CreateUserView.vue') } // หน้า Signup
      ]
    },
    {
      path: '/borrowinfo',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/Borrowinfo.vue') } // หน้า CreateProduct
      ]
    },
    {
      path: '/about',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/AboutView.vue') } // หน้า CreateProduct
      ]
    },
    {
      path: '/profile',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/ProfileView.vue') } // หน้า CreateProduct
      ]
    },
    {
      path: '/product',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/ProductView.vue') } // หน้า Home
      ]
    },
  ]
})

export default router
