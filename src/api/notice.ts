import api from '@/api'

export interface Notice {
    index: number
    title: string
    exposurePage: string
    description: string
    content: string
    order: number
    isShowing: boolean
    registerDatetime: string
}

export const noticeApi = {
    getList: () => api.get('/api/content/notice'),
    getOne: (index: number) => api.get(`/api/content/notice/${index}`),
    create: (data: Partial<Notice>) => api.post('/api/content/notice', data),
    update: (index: number, data: Partial<Notice>) => api.put(`/api/content/notice/${index}`, data),
    delete: (index: number) => api.delete(`/api/content/notice/${index}`),
    updateOrder: (sortedIndexList: number[]) => api.put('/api/content/notice/order', { sortedIndexList }),
    updateStatus: (indexList: number[], isShowing: boolean) => api.put('/api/content/notice/status', { indexList, isShowing }),
}
