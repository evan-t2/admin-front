<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
    TitleComponent, TooltipComponent, LegendComponent,
    GridComponent, DataZoomComponent
} from 'echarts/components'
import {
    dashboardApi,
    type DailySalesStatistic, type ReorderStatistic,
    type CallStatistic, type CustomerServiceStatistic,
    type AffiliateStatistic, type TopAffiliateStatistic
} from '@/api/dashboard'
import PageContainer from '@/components/PageContainer.vue'

use([CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent])

const dailySales = ref<DailySalesStatistic[]>([])
const reorderStats = ref<ReorderStatistic[]>([])
const callStats = ref<CallStatistic | null>(null)
const csStats = ref<CustomerServiceStatistic[]>([])
const affiliateStats = ref<AffiliateStatistic | null>(null)
const topAffiliates = ref<TopAffiliateStatistic[]>([])
const loading = ref(true)

// KPI: 오늘 거래대금, 거래량 (마지막 데이터 기준)
const todaySalesAmount = computed(() => {
    if (!dailySales.value.length) return 0
    const last = dailySales.value[dailySales.value.length - 1]!
    return last.monthSuccessAmount + last.selfSuccessAmount + last.subscriptionSuccessAmount
})
const todaySalesCount = computed(() => {
    if (!dailySales.value.length) return 0
    const last = dailySales.value[dailySales.value.length - 1]!
    return last.monthSuccessCount + last.selfSuccessCount + last.subscriptionSuccessCount
})

// 어제/오늘 상담 통계
const todayCs = computed(() => csStats.value.length >= 1 ? csStats.value[0] : null)
const yesterdayCs = computed(() => csStats.value.length >= 2 ? csStats.value[1] : null)

// 매출 차트 옵션
const salesChartOption = computed(() => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['자체 정산', '월 정산', '월구독 정산', '순이익', 'PG 수수료', '예약 수', '취소 수'], bottom: 30, itemGap: 6, itemWidth: 14, textStyle: { fontSize: 11 } },
    grid: { left: 60, right: 60, top: 30, bottom: 80 },
    dataZoom: [{ type: 'slider', start: 80, end: 100, bottom: 0, height: 20 }],
    xAxis: { type: 'category', data: dailySales.value.map(d => d.date) },
    yAxis: [
        { type: 'value', name: '거래대금(만원)', nameGap: 10, axisLabel: { formatter: (v: number) => (v / 10000).toLocaleString() } },
        { type: 'value', name: '거래 수', nameGap: 10, position: 'right' }
    ],
    series: [
        { name: '자체 정산', type: 'bar', stack: 'settlement', data: dailySales.value.map(d => d.selfAffiliateSettlementTotal), color: '#0D6FFC' },
        { name: '월 정산', type: 'bar', stack: 'settlement', data: dailySales.value.map(d => d.monthAffiliateSettlementTotal), color: '#5395F4' },
        { name: '월구독 정산', type: 'bar', stack: 'settlement', data: dailySales.value.map(d => d.subscriptionAffiliateSettlementTotal), color: '#8DC6FF' },
        { name: '순이익', type: 'bar', stack: 'settlement', data: dailySales.value.map(d => d.totalProfit), color: '#CCE5FF' },
        { name: 'PG 수수료', type: 'bar', stack: 'settlement', data: dailySales.value.map(d => d.totalPgInterest), color: '#4C6379' },
        { name: '예약 수', type: 'line', yAxisIndex: 1, data: dailySales.value.map(d => d.monthSuccessCount + d.selfSuccessCount + d.subscriptionSuccessCount), color: '#fdd400' },
        { name: '취소 수', type: 'line', yAxisIndex: 1, data: dailySales.value.map(d => d.monthCancelCount), color: '#f54463' },
    ]
}))

// 재주문 차트 옵션
const reorderChartOption = computed(() => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['신규주문', '재주문', '재주문 비율'], bottom: 30 },
    grid: { left: 60, right: 60, top: 30, bottom: 80 },
    dataZoom: [{ type: 'slider', start: 80, end: 100, bottom: 0, height: 20 }],
    xAxis: { type: 'category', data: reorderStats.value.map(d => d.date) },
    yAxis: [
        { type: 'value', name: '주문 수' },
        { type: 'value', name: '재주문 비율(%)', position: 'right', max: 100 }
    ],
    series: [
        { name: '신규주문', type: 'bar', stack: 'order', data: reorderStats.value.map(d => d.newOrderCount), color: '#0D6FFC' },
        { name: '재주문', type: 'bar', stack: 'order', data: reorderStats.value.map(d => d.reOrderCount), color: '#5395F4' },
        { name: '재주문 비율', type: 'line', yAxisIndex: 1, data: reorderStats.value.map(d => d.reOrderPercent), color: '#fdd400' },
    ]
}))

function formatPrice(value: number) {
    return value.toLocaleString()
}

async function fetchAll() {
    loading.value = true
    try {
        const [salesRes, reorderRes, callRes, csRes, affRes, topRes]: any[] = await Promise.all([
            dashboardApi.getDailySales(),
            dashboardApi.getReorder(),
            dashboardApi.getCall(),
            dashboardApi.getCustomerService(),
            dashboardApi.getAffiliateSales(),
            dashboardApi.getAffiliateTop(),
        ])
        dailySales.value = salesRes.data || []
        reorderStats.value = reorderRes.data || []
        callStats.value = callRes.data || null
        csStats.value = csRes.data || []
        affiliateStats.value = affRes.data || null
        topAffiliates.value = topRes.data || []
    } catch {}
    finally { loading.value = false }
}

onMounted(fetchAll)
</script>

<template>
    <PageContainer title="카모아 대시보드">
        <div v-loading="loading">
            <!-- KPI 카드 -->
            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="6">
                    <el-card shadow="hover">
                        <div style="text-align: center">
                            <div style="color: #909399; font-size: 14px; margin-bottom: 8px">오늘 거래대금</div>
                            <div style="font-size: 28px; font-weight: bold; color: #409EFF">{{ formatPrice(todaySalesAmount) }}원</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover">
                        <div style="text-align: center">
                            <div style="color: #909399; font-size: 14px; margin-bottom: 8px">오늘 거래량</div>
                            <div style="font-size: 28px; font-weight: bold; color: #409EFF">{{ formatPrice(todaySalesCount) }}건</div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 차트 -->
            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="12">
                    <el-card header="일별 매출 통계">
                        <v-chart :option="salesChartOption" style="height: 550px" autoresize />
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card header="일별 재주문 통계">
                        <v-chart :option="reorderChartOption" style="height: 550px" autoresize />
                    </el-card>
                </el-col>
            </el-row>

            <!-- 통계 테이블 -->
            <el-row :gutter="20" style="margin-bottom: 20px">
                <!-- 어제 콜 통계 -->
                <el-col :span="6">
                    <el-card header="어제 콜 통계">
                        <el-table :data="callStats ? [
                            { type: '통화성공', count: callStats.okState },
                            { type: '통화실패', count: callStats.failState },
                            { type: '받지않음', count: callStats.noAnswerState },
                            { type: '통화중', count: callStats.busyState },
                        ] : []" border size="small">
                            <el-table-column prop="type" label="종류" />
                            <el-table-column prop="count" label="횟수" align="right" />
                        </el-table>
                    </el-card>
                </el-col>
                <!-- 어제 상담 통계 -->
                <el-col :span="6">
                    <el-card header="어제 상담 통계">
                        <el-table :data="yesterdayCs ? [
                            { type: '상담중', count: yesterdayCs.openState },
                            { type: '완료', count: yesterdayCs.closedState },
                        ] : []" border size="small" :empty-text="'데이터가 없습니다.'">
                            <el-table-column prop="type" label="종류" />
                            <el-table-column prop="count" label="횟수" align="right" />
                        </el-table>
                    </el-card>
                </el-col>
                <!-- 오늘 상담 통계 -->
                <el-col :span="6">
                    <el-card header="오늘 상담 통계">
                        <el-table :data="todayCs ? [
                            { type: '상담중', count: todayCs.openState },
                            { type: '완료', count: todayCs.closedState },
                        ] : []" border size="small" :empty-text="'데이터가 없습니다.'">
                            <el-table-column prop="type" label="종류" />
                            <el-table-column prop="count" label="횟수" align="right" />
                        </el-table>
                    </el-card>
                </el-col>
                <!-- 파트너사 통계 -->
                <el-col :span="6">
                    <el-card header="파트너사 통계">
                        <el-table :data="affiliateStats ? [
                            { type: '심플', count: affiliateStats.simpleVersionUseCount },
                            { type: '풀', count: affiliateStats.fullVersionUseCount },
                            { type: 'API', count: affiliateStats.apiUseCount },
                        ] : []" border size="small">
                            <el-table-column prop="type" label="종류" />
                            <el-table-column prop="count" label="파트너사 수" align="right" />
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>

            <!-- TOP 10 제휴사 -->
            <el-row>
                <el-col :span="24">
                    <el-card header="TOP 10 제휴사 매출 통계">
                        <el-table :data="topAffiliates" border size="small">
                            <el-table-column type="index" label="순위" width="60" align="center" />
                            <el-table-column prop="companyName" label="회사명" min-width="200" />
                            <el-table-column label="계약건수" width="120" align="right">
                                <template #default="{ row }">{{ formatPrice(row.totalCount) }}</template>
                            </el-table-column>
                            <el-table-column label="매출액" width="150" align="right">
                                <template #default="{ row }">{{ formatPrice(row.totalPrice) }}원</template>
                            </el-table-column>
                            <el-table-column label="가입일" width="120" align="center">
                                <template #default="{ row }">{{ row.companyRegdate?.substring(0, 10) }}</template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </PageContainer>
</template>
