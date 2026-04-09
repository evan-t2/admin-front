import api from '@/api'

export interface PostListItem {
    index: number
    title: string
    description: string
    thumbnailImage: string
    categoryName: string
    status: string
    carmorePostCreatorName: string
    registerAdmin: string
    registerDatetime: string
}

export interface Post {
    index: number
    title: string
    description: string
    thumbnailImage: string
    registerAdmin: string
    categoryIndex: number
    categoryName: string
    isCommentAvailable: number
    status: string
    html: string
    markdown: string
    carmorePostCreatorName: string
    seoTitle: string
    seoDescription: string
    registerDatetime: string
}

export interface PostCategory {
    index: number
    name: string
    status: string
}

export interface SavePostRequest {
    title: string
    description?: string
    thumbnailImage?: string
    categoryIndex: number
    isCommentAvailable: number
    status?: string
    html?: string
    markdown?: string
    carmorePostCreatorName: string
    seoTitle?: string
    seoDescription?: string
}

export const postTabApi = {
    getList: (params?: { category?: number; search?: string; page?: number }) =>
        api.get('/api/content/post-tab', { params }),
    getOne: (index: number) => api.get(`/api/content/post-tab/${index}`),
    create: (data: SavePostRequest) => api.post('/api/content/post-tab', data),
    update: (index: number, data: SavePostRequest) => api.put(`/api/content/post-tab/${index}`, data),
    getCategories: () => api.get('/api/content/post-tab/categories'),
}
