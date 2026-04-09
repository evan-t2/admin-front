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
                { path: '', redirect: '/dashboard' },
                { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
                // 공지사항
                { path: 'notice', name: 'notice', component: () => import('@/views/notice/NoticeListView.vue') },
                { path: 'notice/create', name: 'notice-create', component: () => import('@/views/notice/NoticeFormView.vue') },
                { path: 'notice/:index', name: 'notice-edit', component: () => import('@/views/notice/NoticeFormView.vue') },
                // FAQ
                { path: 'faq', name: 'faq', component: () => import('@/views/faq/FaqView.vue') },
                // MD 추천
                { path: 'content/md-recommendation', name: 'md-recommendation', component: () => import('@/views/content/MdRecommendationView.vue') },
                // 포스트탭
                { path: 'content/post-tab', name: 'post-tab', component: () => import('@/views/content/PostTabListView.vue') },
                { path: 'content/post-tab/create', name: 'post-tab-create', component: () => import('@/views/content/PostTabFormView.vue') },
                { path: 'content/post-tab/:index', name: 'post-tab-edit', component: () => import('@/views/content/PostTabFormView.vue') },
                // 환경설정
                { path: 'settings/teams', name: 'settings-teams', component: () => import('@/views/settings/TeamListView.vue') },
                { path: 'settings/admins', name: 'settings-admins', component: () => import('@/views/settings/AdminListView.vue') },
                { path: 'settings/admins/create', name: 'settings-admin-create', component: () => import('@/views/settings/AdminFormView.vue') },
                { path: 'settings/admins/:adminIdx', name: 'settings-admin-edit', component: () => import('@/views/settings/AdminFormView.vue') },
                { path: 'settings/password', name: 'settings-password', component: () => import('@/views/settings/PasswordChangeView.vue') },
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
