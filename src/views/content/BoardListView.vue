<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { boardApi, type BoardListItem } from '@/api/board'
import PageContainer from '@/components/PageContainer.vue'

const router = useRouter()
const items = ref<BoardListItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalElements = ref(0)
const pageSize = ref(20)
const searchParam = ref('board_title')
const searchValue = ref('')

async function fetchList() {
    loading.value = true
    try {
        const res: any = await boardApi.getList({
            searchParam: searchParam.value,
            searchValue: searchValue.value || undefined,
            page: currentPage.value,
        })
        const page = res.data
        items.value = page.content || []
        totalElements.value = page.totalElements || 0
        pageSize.value = page.size || 20
    } catch { ElMessage.error('게시판 목록을 불러오지 못했습니다.') }
    finally { loading.value = false }
}

function handleSearch() { currentPage.value = 1; fetchList() }
function handlePageChange(page: number) { currentPage.value = page; fetchList() }

async function handleDelete(index: number) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try { await boardApi.delete(index); ElMessage.success('삭제되었습니다.'); fetchList() } catch {}
}

async function handleChangeStats(index: number, stats: string) {
    try { await boardApi.changeStats(index, stats); ElMessage.success('상태가 변경되었습니다.'); fetchList() } catch {}
}

onMounted(fetchList)
</script>

<template>
    <PageContainer title="게시판 관리">
        <template #actions>
            <el-button type="primary" @click="router.push('/content/board/create')">글 등록</el-button>
        </template>
        <div style="display: flex; gap: 8px; margin-bottom: 16px">
            <el-select v-model="searchParam" style="width: 140px">
                <el-option label="제목" value="board_title" />
                <el-option label="내용" value="board_content" />
            </el-select>
            <el-input v-model="searchValue" placeholder="검색어 입력" clearable style="width: 240px" @keyup.enter="handleSearch" />
            <el-button @click="handleSearch">검색</el-button>
        </div>
        <el-table :data="items" v-loading="loading" border>
            <el-table-column prop="index" label="번호" width="70" align="center" />
            <el-table-column prop="boardPart" label="카테고리" width="100" align="center" />
            <el-table-column label="상태" width="90" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.stats === 'y' ? 'success' : 'danger'" size="small" style="cursor: pointer"
                            @click="handleChangeStats(row.index, row.stats === 'y' ? 'n' : 'y')">
                        {{ row.stats === 'y' ? '처리완료' : '처리대기' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="제목" min-width="200">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/content/board/${row.index}`)">
                        {{ row.title }}
                        <el-badge v-if="row.replyCount > 0" :value="row.replyCount" type="info" style="margin-left: 4px" />
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="memId" label="작성자" width="140" align="center" />
            <el-table-column prop="regdate" label="등록일" width="170" align="center" />
            <el-table-column label="관리" width="80" align="center">
                <template #default="{ row }"><el-button type="danger" size="small" text @click="handleDelete(row.index)">삭제</el-button></template>
            </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: center; margin-top: 16px">
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalElements"
                           layout="prev, pager, next" @current-change="handlePageChange" />
        </div>
    </PageContainer>
</template>
