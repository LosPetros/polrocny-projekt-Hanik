import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import SearchPage from '../pages/SearchPage.vue'
import MyBookingsPage from '../pages/MyBookingsPage.vue'
import HotelDetailPage from '../pages/HotelDetailPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import OwnerDashboardPage from '../pages/OwnerDashboardPage.vue'
import OwnerHotelDetailPage from '../pages/OwnerHotelDetailPage.vue'
import AdminHotelDetailPage from '../pages/AdminHotelDetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true } // Only accessible when not logged in
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guest: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
    // Public page - no auth required
  },
  {
    path: '/hotel/:id',
    name: 'HotelDetail',
    component: HotelDetailPage
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/owner',
    name: 'OwnerDashboard',
    component: OwnerDashboardPage,
    meta: { requiresAuth: true, requiresOwner: true }
  },
  {
    path: '/owner/hotels/:id',
    name: 'OwnerHotelDetail',
    component: OwnerHotelDetailPage,
    meta: { requiresAuth: true, requiresOwner: true }
  },
  {
    path: '/admin/hotels/:id',
    name: 'AdminHotelDetail',
    component: AdminHotelDetailPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Try to fetch user if not already loaded
  if (!authStore.user && !authStore.loading) {
    await authStore.fetchMe()
  }

  const isAuthenticated = !!authStore.user
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const requiresOwner = to.meta.requiresOwner
  const isGuestRoute = to.meta.guest

  // If route requires auth and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // If route requires admin and user is not admin
  if (requiresAdmin && (!isAuthenticated || authStore.user.role !== 'admin')) {
    next('/search')
    return
  }

  // If route requires owner and user is not owner
  if (requiresOwner && (!isAuthenticated || authStore.user.role !== 'owner')) {
    next('/search')
    return
  }

  // If guest route (login/register) and user is already authenticated
  if (isGuestRoute && isAuthenticated) {
    next('/search')
    return
  }

  next()
})

export default router
