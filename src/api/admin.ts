import api from '@/api'

export interface Admin {
    adminIdx: number
    adminName: string
    adminEmail: string
    teamCode: string
    teamName: string
    adminType: number
    adminStats: string
    masterYn: string
}

export interface AdminDetail extends Admin {
    adminTel: string
    memberGrade: string
    carmoreUserIds: { carmoreUserId: string; userType: string }[]
}

export const adminApi = {
    getList: () => api.get('/api/admins'),
    getOne: (adminIdx: number) => api.get(`/api/admins/${adminIdx}`),
    create: (data: any) => api.post('/api/admins', data),
    update: (adminIdx: number, data: any) => api.put(`/api/admins/${adminIdx}`, data),
    delete: (adminIdx: number) => api.delete(`/api/admins/${adminIdx}`),
}
