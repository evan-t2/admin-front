import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status
        const message = error.response?.data?.message || '서버 오류가 발생했습니다.'

        if (status === 401) {
            localStorage.removeItem('token')
            router.push('/login')
        } else if (status === 403) {
            ElMessage.error('접근 권한이 없습니다.')
            router.push('/forbidden')
        } else {
            ElMessage.error(message)
        }

        return Promise.reject(error)
    },
)

export default api
