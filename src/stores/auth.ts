import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))

    const isLoggedIn = computed(() => !!token.value)

    async function login(email: string, password: string) {
        const res: any = await api.post('/api/auth/login', { email, password })
        token.value = res.data.token
        localStorage.setItem('token', res.data.token)
        router.push('/')
    }

    function logout() {
        token.value = null
        localStorage.removeItem('token')
        router.push('/login')
    }

    return { token, isLoggedIn, login, logout }
})
