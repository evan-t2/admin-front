import api from '@/api'

export interface FaqCategory {
    index: number
    parentIndex: number
    name: string
    order: number
    status: string
    children: FaqCategory[]
}

export interface FaqQuestion {
    index: number
    categoryIndex: number
    categoryName: string
    parentCategoryIndex: number
    parentCategoryName: string
    title: string
    content: string
    order: number
    status: string
}

export const faqCategoryApi = {
    getList: () => api.get('/api/faq/categories'),
    create: (data: { parentIndex: number; name: string; status: string }) => api.post('/api/faq/categories', data),
    update: (index: number, data: { name: string; status: string }) => api.put(`/api/faq/categories/${index}`, data),
    delete: (index: number) => api.delete(`/api/faq/categories/${index}`),
    changeOrder: (list: { index: number; order: number }[]) => api.put('/api/faq/categories/order', list),
}

export const faqQuestionApi = {
    getList: (category?: number) => api.get('/api/faq/questions', { params: { category } }),
    getOne: (index: number) => api.get(`/api/faq/questions/${index}`),
    create: (data: { categoryIndex: number; title: string; content: string; status: string }) => api.post('/api/faq/questions', data),
    update: (index: number, data: { categoryIndex: number; title: string; content: string; status: string }) => api.put(`/api/faq/questions/${index}`, data),
    delete: (index: number) => api.delete(`/api/faq/questions/${index}`),
    changeOrder: (list: { index: number; order: number }[]) => api.put('/api/faq/questions/order', list),
}
