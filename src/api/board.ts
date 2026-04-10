import api from '@/api'

export interface BoardListItem {
    index: number
    title: string
    boardPart: string
    stats: string
    memId: string
    regdate: string
    usrSerial: number | null
    replyCount: number
}

export interface Comment {
    index: number
    commentText: string
    memId: string
    regdate: string
}

export interface Board {
    index: number
    contentCode: string
    title: string
    content: string
    boardCode: string
    boardPart: string
    stats: string
    memId: string
    regdate: string
    usrSerial: number | null
    readCount: number
    comments: Comment[]
}

export interface SaveBoardRequest {
    title: string
    content?: string
    boardPart?: string
    usrSerial?: number
    startDate?: string
    endDate?: string
}

export const boardApi = {
    getList: (params?: { searchParam?: string; searchValue?: string; page?: number }) =>
        api.get('/api/content/board', { params }),
    getOne: (index: number) => api.get(`/api/content/board/${index}`),
    create: (data: SaveBoardRequest) => api.post('/api/content/board', data),
    update: (index: number, data: SaveBoardRequest) => api.put(`/api/content/board/${index}`, data),
    delete: (index: number) => api.delete(`/api/content/board/${index}`),
    createComment: (data: { boardIndex: number; commentText: string }) => api.post('/api/content/board/comments', data),
    deleteComment: (commentIndex: number) => api.delete(`/api/content/board/comments/${commentIndex}`),
    changeStats: (index: number, stats: string) => api.put(`/api/content/board/${index}/stats`, { stats }),
}
