import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { public: true },
        },
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/DashboardView.vue'),
                },
                {
                    path: 'notice',
                    name: 'notice',
                    component: () => import('@/views/notice/NoticeListView.vue'),
                },
                {
                    path: 'notice/:index',
                    name: 'notice-detail',
                    component: () => import('@/views/notice/NoticeDetailView.vue'),
                },
                {
                    path: 'faq',
                    name: 'faq',
                    component: () => import('@/views/faq/FaqView.vue'),
                },
            ],
        },
    ],
})

router.beforeEach((to) => {
    const token = localStorage.getItem('token')
    if (!to.meta.public && !token) {
        return '/login'
    }
})

export default router
