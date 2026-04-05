import api from '@/api'

export interface MdRecommendation {
    index: number
    affiliateName: string
    description: string
    order: number
    createdAt: string
}

export const mdRecommendationApi = {
    getList: (page?: number) => api.get('/api/content/md-recommendation', { params: { page } }),
    create: (data: { affiliateName: string; description: string }) => api.post('/api/content/md-recommendation', data),
    update: (index: number, data: { description: string }) => api.put(`/api/content/md-recommendation/${index}`, data),
    delete: (index: number) => api.delete(`/api/content/md-recommendation/${index}`),
}
