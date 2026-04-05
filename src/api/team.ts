import api from '@/api'

export interface Team {
    teamCode: string
    teamName: string
    memberCount: number
}

export const teamApi = {
    getList: () => api.get('/api/teams'),
    getOne: (teamCode: string) => api.get(`/api/teams/${teamCode}`),
    create: (data: { teamCode: string; teamName: string }) => api.post('/api/teams', data),
    update: (teamCode: string, data: { teamName: string }) => api.put(`/api/teams/${teamCode}`, data),
    delete: (teamCode: string) => api.delete(`/api/teams/${teamCode}`),
}
