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
      component: () => import('../Layouts/AdminLayout.vue'), // ใช้ DrawerLayout
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
      path: '/about',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/AboutView.vue') } // หน้า CreateProduct
      ]
    },
    {
      path: '/profile/:id',
      name:'profile',
      component: () => import('../Layouts/NoDrawerLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/ProfileView.vue') } // หน้า CreateProduct
      ]
    },
    {
      path: '/product',
      component: () => import('../Layouts/AdminLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/ProductView.vue') }
      ]
    },
    { // หน้า Home
      path: '/borrow/:id',
      name:'borrow',
      component: () => import('../Layouts/UserLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/BorrowView.vue') } // หน้า CreateProduct
      ]
    },
    { // หน้า Home
      path: '/borrowinfo',
      component: () => import('../Layouts/AdminLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/Borrowinfo.vue') } // หน้า CreateProduct
      ]
    },
    { // หน้า Home
      path: '/userinfo',
      component: () => import('../Layouts/AdminLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/UserInfo.vue') } // หน้า CreateProduct
      ]
    },
    { // หน้า Home
      path: '/prodreport',
      component: () => import('../Layouts/AdminLayout.vue'), // ใช้ DrawerLayout
      children: [
        { path: '', component: () => import('../views/ProductReport.vue') } // หน้า CreateProduct
      ]
    },

  ]
})


export default router
