import api from '@/api'

export interface DailySalesStatistic {
    date: string
    monthSuccessCount: number
    monthCancelCount: number
    monthSuccessAmount: number
    monthCancelAmount: number
    selfSuccessCount: number
    selfSuccessAmount: number
    subscriptionSuccessCount: number
    subscriptionSuccessAmount: number
    monthAffiliateSettlementTotal: number
    selfAffiliateSettlementTotal: number
    subscriptionAffiliateSettlementTotal: number
    totalProfit: number
    totalPgInterest: number
}

export interface ReorderStatistic {
    date: string
    totalOrderCount: number
    newOrderCount: number
    reOrderCount: number
    reOrderPercent: number
}

export interface CallStatistic {
    okState: number
    failState: number
    noAnswerState: number
    busyState: number
}

export interface CustomerServiceStatistic {
    date: string
    openState: number
    closedState: number
}

export interface AffiliateStatistic {
    simpleVersionUseCount: number
    fullVersionUseCount: number
    apiUseCount: number
}

export interface TopAffiliateStatistic {
    companyName: string
    totalCount: number
    totalPrice: number
    companyRegdate: string
}

export const dashboardApi = {
    getDailySales: () => api.get('/api/dashboard/daily-sales'),
    getReorder: () => api.get('/api/dashboard/reorder'),
    getCall: () => api.get('/api/dashboard/call'),
    getCustomerService: () => api.get('/api/dashboard/customer-service'),
    getAffiliateSales: () => api.get('/api/dashboard/affiliate-sales'),
    getAffiliateTop: () => api.get('/api/dashboard/affiliate-top'),
    getUserUsability: () => api.get('/api/dashboard/user-usability'),
    getUserSignup: () => api.get('/api/dashboard/user-signup'),
}
