<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const menuSearch = ref('')
const menuRef = ref<any>(null)

// 즐겨찾기
const FAVORITE_KEY = 'workspace-favorite-menu'
const favorites = ref<string[]>(JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]'))

function toggleFavorite(path: string) {
    const idx = favorites.value.indexOf(path)
    if (idx === -1) {
        favorites.value.push(path)
    } else {
        favorites.value.splice(idx, 1)
    }
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites.value))
}

function isFavorite(path: string) {
    return favorites.value.includes(path)
}

// 즐겨찾기 메뉴 아이템
const favoriteMenuItems = computed(() => {
    const items: { title: string; path: string }[] = []
    for (const group of menuGroups) {
        for (const child of group.children) {
            if (!child.divider && child.path && favorites.value.includes(child.path)) {
                items.push({ title: child.title!, path: child.path })
            }
        }
    }
    return items
})

// 검색 시 자동 펼침
watch(menuSearch, (val) => {
    if (val && menuRef.value) {
        filteredMenuGroups.value.forEach((_, i) => {
            menuRef.value?.open('group-' + i)
        })
    }
})

const menuGroups = [
    {
        title: 'DashBoard',
        icon: 'DataBoard',
        children: [
            { title: '대시보드', path: '/dashboard' },
            { divider: true },
            { title: '매출(거래액) 대시보드', path: '/statistics/sales-dashboard' },
            { title: '실시간매출통계', path: '/statistics/main' },
            { title: '광고대행사용 실시간매출통계', path: '/statistics/agency' },
            { title: '기간별통계', path: '/statistics/period' },
            { title: '신규/재주문통계', path: '/statistics/reorder' },
            { title: '신규/재주문통계(회사별)', path: '/statistics/company-reorder' },
            { title: '순이익 통계', path: '/statistics/profit' },
            { divider: true },
            { title: '내륙/제주/해외 통계', path: '/statistics/location-group' },
            { title: '고객군별 통계', path: '/statistics/customer-group' },
            { title: '제휴처별 통계', path: '/statistics/reservation-origin' },
            { divider: true },
            { title: '회원가입통계', path: '/statistics/member' },
            { title: '사용성통계', path: '/statistics/user-usability' },
            { divider: true },
            { title: '요일/시간통계', path: '/statistics/time' },
            { title: '예약/대여일 Gap', path: '/statistics/date-gap' },
            { divider: true },
            { title: '회사별통계', path: '/statistics/company' },
            { title: '차종별통계', path: '/statistics/car-type' },
            { title: '연료별통계', path: '/statistics/fuel-type' },
            { title: '업체이관 통계', path: '/statistics/reservation-transfer' },
            { title: '배차불가 통계', path: '/statistics/non-dispatchable' },
            { divider: true },
            { title: '제휴사 전화통계', path: '/statistics/call' },
            { title: '주간 전화연결 통계', path: '/statistics/call-detail' },
            { title: '단기렌트_검색 통계', path: '/statistics/short-rent' },
            { title: '장기렌트_검색 통계', path: '/statistics/long-rent' },
            { divider: true },
            { title: '지역/업체별 매출성과', path: '/statistics/monthly' },
            { divider: true },
            { title: '관리자 콜 통계', path: '/statistics/customer-service' },
        ],
    },
    {
        title: '카모아 앱 관리',
        icon: 'Iphone',
        children: [
            { title: '회원관리', path: '/users' },
            { divider: true },
            { title: '카모아 버전관리', path: '/version' },
            { title: '카모아 주요지역 관리', path: '/locations/special' },
            { title: '카모아 국가 관리', path: '/locations/national' },
            { title: '성수기관리', path: '/peakseason' },
            { title: '공휴일 관리', path: '/alternative-holiday' },
            { title: '자주 묻는 질문 관리', path: '/faq' },
            { title: '차량노출상태 관리', path: '/cars/showing-status' },
            { title: '카모아 서버 점검 설정', path: '/server-check' },
            { title: '카모아 알림 설정', path: '/notifications/alarm' },
            { divider: true },
            { title: '위치정보이용 로그', path: '/locations/usage-log' },
            { divider: true },
            { title: '단기 차량리스트 시뮬레이터', path: '/cars/simulator' },
        ],
    },
    {
        title: '차량/예약관리',
        icon: 'Van',
        children: [
            { title: '차량예약관리 (단기)', path: '/reservations' },
            { title: '차량예약관리 (월)', path: '/reservations?type=month' },
            { title: '차량예약관리 (월구독)', path: '/reservations?type=subscription' },
            { title: '차량조기반납신청', path: '/early-car-return' },
            { title: '예약 취소사유 관리', path: '/reservations/cancel-reasons' },
            { divider: true },
            { title: '알림톡 전송목록', path: '/notifications/toast-alarm' },
            { title: '비즈톡 전송오류목록', path: '/notifications/biztalk-errors' },
            { title: '알림톡 전송오류목록', path: '/notifications/toast-alarm-errors' },
            { divider: true },
            { title: '차량 마스터 정보', path: '/cars/master' },
            { title: '차량매칭하기', path: '/cars/matching' },
            { title: '차종 해시태그 관리', path: '/cars/hashtags' },
            { title: '상위 차량 관리', path: '/cars/model-grouping' },
            { divider: true },
            { title: 'SMS 발송', path: '/notifications/sms/send' },
            { title: 'SMS 발송 내역', path: '/notifications/sms' },
            { title: 'SMS 발송 문구', path: '/notifications/sms/templates' },
            { title: '필터링 관리', path: '/product-filtering' },
            { divider: true },
            { title: '월구독 할인율 설정', path: '/subscription-discount' },
        ],
    },
    {
        title: '카모아 API',
        icon: 'Connection',
        children: [
            { title: '판매 업체 리스트', path: '/carmore-api/affiliates' },
            { title: 'API 키 관리', path: '/carmore-api/tokens' },
            { title: 'API 판매업체 관리', path: '/carmore-api/sales' },
            { divider: true },
            { title: 'API 예약 목록', path: '/carmore-api/reservations' },
        ],
    },
    {
        title: '제휴사 관리',
        icon: 'OfficeBuilding',
        children: [
            { title: '업체 지점 관리', path: '/partners/branches' },
            { title: '업체 주요지역 관리', path: '/partners/special-locations' },
            { title: '지역별 종합 지점 판매시간', path: '/partners/opening-time' },
            { title: '성수기 요금 등록 여부', path: '/partners/price-statistics' },
            { title: '서비스지역 변경 요청 처리', path: '/partners/service-area-requests' },
            { title: '파트너스 정보 변경 요청 처리', path: '/partners/affiliate-requests' },
            { title: '업체한마디 변경 요청 처리', path: '/partners/intro-requests' },
            { divider: true },
            { title: '리뷰관리', path: '/partners/reviews' },
            { title: '벌점 부여 내역', path: '/penalty/logs' },
            { divider: true },
            { title: '유모차/카시트 업체 관리', path: '/strollers' },
            { divider: true },
            { title: '050 전체리스트', path: '/partners/tel050?type=use' },
            { title: '050 결번리스트', path: '/partners/tel050?type=expire' },
            { title: '050 골드넘버', path: '/partners/tel050?type=gold' },
            { title: '전화걸기 업체관리', path: '/partners/call' },
            { divider: true },
            { title: '공지사항', path: '/partners/notice' },
        ],
    },
    {
        title: '제주 API 업체 관리',
        icon: 'Ship',
        children: [
            { title: '제주 API 예약목록', path: '/api-affiliates/reservations' },
            { divider: true },
            { title: '제주 API 업체 관리', path: '/api-affiliates' },
            { title: '제주 API 업체 차량관리', path: '/api-affiliates/cars' },
            { divider: true },
            { title: '종합보험 관리', path: '/api-affiliates/compensations' },
            { title: '자차보험 관리', path: '/api-affiliates/cdw' },
        ],
    },
    {
        title: '글로벌 API 관리',
        icon: 'Place',
        children: [
            { title: '해외 API 예약목록', path: '/global/reservations' },
            { title: '해외 차량 정보 매칭', path: '/global/cars/matching' },
            { title: '랜드마크 설정', path: '/locations/landmarks' },
            { title: '해외 API 및 직판 업체 정보 매칭', path: '/global/affiliates/matching' },
            { title: '국가별 마크업 관리', path: '/global/national-markup' },
        ],
    },
    {
        title: '판매대행사 업체 관리',
        icon: 'Sell',
        children: [
            { title: '판매대행사 매출 관리', path: '/statistics/sale-agency' },
            { title: '아웃링크 판매대행사 매출 관리', path: '/statistics/outlink-agency' },
            { title: '판매대행사 정산 관리', path: '/agency/settlements' },
            { title: '판매대행사 접속 키 관리', path: '/partnership/keys' },
            { title: '난수 쿠폰 관리', path: '/coupons/usage' },
            { title: '바우쳐 쿠폰 관리', path: '/coupons/voucher' },
            { title: 'OTA API 판매용 정산매출통계', path: '/statistics/ota-agency' },
        ],
    },
    {
        title: '정산 관리',
        icon: 'Money',
        children: [
            { title: '정산관리', path: '/settlements' },
            { title: '정산메일폼관리', path: '/settlements/mail-form' },
            { divider: true },
            { title: '업체별 정산/세금정보', path: '/settlements/branch-tax' },
            { divider: true },
            { title: '세금계산서 회사정보', path: '/settlements/tax-info' },
            { title: '세금계산서 발행내역', path: '/settlements/tax-paper-log' },
            { divider: true },
            { title: '정산이슈목록', path: '/settlements/issues' },
            { title: '정산제외목록', path: '/settlements/excluded' },
        ],
    },
    {
        title: '한인/해외 정산 관리',
        icon: 'Coin',
        children: [
            { title: '해외 업체별 정산 정보', path: '/settlements/overseas/info' },
            { title: '해외 정산 관리', path: '/settlements/overseas' },
            { title: '해외 환율 마크업 관리', path: '/overseas-exchange' },
        ],
    },
    {
        title: '마케팅 관리',
        icon: 'TrendCharts',
        children: [
            { title: '이벤트 성과', path: '/statistics/marketing' },
            { title: '메인페이지 관리', path: '/content/main-page' },
            { title: '공지사항 관리', path: '/notice' },
            { title: '인기지역 관리', path: '/locations/popular' },
            { title: '쿠폰등록관리', path: '/coupons' },
            { title: '패키지 쿠폰관리', path: '/coupons/packages' },
            { title: '이벤트관리', path: '/events' },
            { title: '사전 알림 신청관리', path: '/events/pre-notice' },
            { title: 'PG사 정보 관리', path: '/pg' },
            { title: '딥링크 만들기', path: '/deeplink' },
            { title: '이미지 관리', path: '/images' },
            { title: '차량가동률 통계', path: '/statistics/car-operation-rate' },
            { title: '유입경로 관리', path: '/join-paths' },
            { title: '마케팅 메일 발송', path: '/notifications/email' },
            { title: '이벤트 댓글 관리', path: '/events/comments' },
            { title: '아웃링크 관리', path: '/outlink-agents' },
            { title: '포스트 작성 내역', path: '/content/post-tab' },
        ],
    },
    {
        title: '상담 관리',
        icon: 'Headset',
        children: [
            { title: '상담 관리', path: '/customer-service' },
            { title: '상담 전화 컨트롤러', path: '/customer-service/call-controller' },
            { title: '상담 카테고리 관리', path: '/customer-service/categories' },
            { title: 'CS 공지사항', path: '/customer-service/notice' },
        ],
    },
    {
        title: '카모아 TV 관리',
        icon: 'Monitor',
        children: [
            { title: '카모아 배너 관리', path: '/content/tv-banners' },
        ],
    },
    {
        title: 'KTX 판매 관리',
        icon: 'Ticket',
        children: [
            { title: 'KTX 판매 관리', path: '/ktx/orders' },
        ],
    },
    {
        title: '보험 판매 관리',
        icon: 'FirstAidKit',
        children: [
            { title: '보험 판매 관리', path: '/insu/contracts' },
            { title: '보험 통계', path: '/insu/statistics' },
        ],
    },
    {
        title: '환경설정',
        icon: 'Setting',
        children: [
            { title: '팀정보 관리', path: '/settings/teams' },
            { title: '관리자 관리', path: '/settings/admins' },
            { divider: true },
            { title: '비밀번호 변경', path: '/settings/password' },
        ],
    },
]

const filteredMenuGroups = computed(() => {
    const keyword = menuSearch.value.trim().toLowerCase()
    if (!keyword) return menuGroups
    return menuGroups
        .map((group) => ({
            ...group,
            children: group.children.filter((item: any) =>
                !item.divider && item.title?.toLowerCase().includes(keyword)
            ),
        }))
        .filter((group) => group.children.length > 0)
})
</script>

<template>
    <el-container style="height: 100vh">
        <el-aside width="240px" style="background: #001529; overflow-y: auto">
            <div style="padding: 20px; text-align: center; color: #fff; font-size: 18px; font-weight: bold">
                CarMore Admin
            </div>
            <el-menu
                ref="menuRef"
                :default-active="$route.path"
                router
                background-color="#001529"
                text-color="#ffffffb3"
                active-text-color="#fff"
            >
                <!-- 호텔모아 바로가기 -->
                <a href="https://admin.hotelmore.kr" target="_blank" style="text-decoration: none">
                    <div style="padding: 12px 20px; color: #fff; font-size: 14px; background: linear-gradient(#0073ff, #5893d8); cursor: pointer;">
                        호텔모아 바로가기
                    </div>
                </a>

                <!-- 메뉴 검색 -->
                <div style="padding: 8px 12px">
                    <el-input
                        v-model="menuSearch"
                        placeholder="메뉴 검색"
                        prefix-icon="Search"
                        size="small"
                        clearable
                    />
                </div>

                <!-- 즐겨찾는 메뉴 -->
                <el-sub-menu index="group-favorite">
                    <template #title>
                        <el-icon><Star /></el-icon>
                        <span>즐겨찾는 메뉴</span>
                    </template>
                    <el-menu-item v-if="favoriteMenuItems.length === 0" disabled>
                        <span style="font-size: 12px; color: #999">즐겨찾기한 메뉴가 없습니다</span>
                    </el-menu-item>
                    <el-menu-item v-for="item in favoriteMenuItems" :key="'fav-' + item.path" :index="item.path">
                        {{ item.title }}
                    </el-menu-item>
                </el-sub-menu>

                <el-sub-menu v-for="(group, i) in filteredMenuGroups" :key="i" :index="'group-' + i">
                    <template #title>
                        <el-icon>
                            <component :is="group.icon" />
                        </el-icon>
                        <span>{{ group.title }}</span>
                    </template>
                    <template v-for="(item, j) in group.children" :key="j">
                        <el-divider v-if="item.divider" style="margin: 4px 0; border-color: #ffffff1a" />
                        <el-menu-item v-else :index="item.path" class="menu-item-with-star">
                            <span style="flex: 1">{{ item.title }}</span>
                            <el-icon
                                class="favorite-star"
                                :style="{ color: isFavorite(item.path!) ? '#f7ba2a' : '#ffffff33' }"
                                @click.prevent.stop="toggleFavorite(item.path!)"
                            >
                                <StarFilled v-if="isFavorite(item.path!)" />
                                <Star v-else />
                            </el-icon>
                        </el-menu-item>
                    </template>
                </el-sub-menu>

            </el-menu>

            <div class="bottom-menu">
                <!-- TODO: 마스터일 때만 노출, 현재 페이지의 권한 설정 모달 -->
                <div class="bottom-menu-link">
                    <el-icon><Setting /></el-icon>
                    <span>권한 설정</span>
                </div>
                <div class="bottom-menu-link" @click="auth.logout">
                    <el-icon><SwitchButton /></el-icon>
                    <span>로그아웃</span>
                </div>
            </div>
        </el-aside>

        <el-container>
            <el-main style="background: #f5f5f5">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-menu-item {
    font-size: 13px;
    white-space: normal;
    line-height: 1.4;
    height: auto;
    min-height: 40px;
    display: flex;
    align-items: center;
}

.el-aside {
    display: flex;
    flex-direction: column;
}

.el-aside .el-menu {
    flex: 1;
    overflow-y: auto;
}

.bottom-menu {
    border-top: 1px solid #ffffff1a;
    padding: 8px 0;
}

.bottom-menu-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    color: #ffffffb3;
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
}

.bottom-menu-link:hover {
    color: #fff;
}

.menu-item-with-star {
    display: flex !important;
    align-items: center;
}

.favorite-star {
    font-size: 14px;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s;
}

.menu-item-with-star:hover .favorite-star {
    opacity: 1;
}

.favorite-star:hover {
    color: #f7ba2a !important;
}

.el-aside ::-webkit-scrollbar {
    width: 6px;
}

.el-aside ::-webkit-scrollbar-track {
    background: #001529;
}

.el-aside ::-webkit-scrollbar-thumb {
    background: #ffffff33;
    border-radius: 3px;
}

.el-aside ::-webkit-scrollbar-thumb:hover {
    background: #ffffff55;
}
</style>
