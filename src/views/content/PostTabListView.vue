<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { postTabApi, type PostListItem, type PostCategory } from '@/api/postTab'
import PageContainer from '@/components/PageContainer.vue'

const router = useRouter()
const items = ref<PostListItem[]>([])
const categories = ref<PostCategory[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalElements = ref(0)
const pageSize = ref(20)
const searchCategory = ref<number | undefined>(undefined)
const searchText = ref('')

async function fetchCategories() {
    try { const res: any = await postTabApi.getCategories(); categories.value = res.data || [] } catch {}
}

async function fetchList() {
    loading.value = true
    try {
        const res: any = await postTabApi.getList({
            category: searchCategory.value,
            search: searchText.value || undefined,
            page: currentPage.value,
        })
        const page = res.data
        items.value = page.content || []
        totalElements.value = page.totalElements || 0
        pageSize.value = page.size || 20
    } catch { ElMessage.error('포스트 목록을 불러오지 못했습니다.') }
    finally { loading.value = false }
}

function handleSearch() { currentPage.value = 1; fetchList() }
function handlePageChange(page: number) { currentPage.value = page; fetchList() }

onMounted(() => { fetchCategories(); fetchList() })
</script>

<template>
    <PageContainer title="포스트탭 관리">
        <template #actions>
            <el-button type="primary" @click="router.push('/content/post-tab/create')">포스트 등록</el-button>
        </template>
        <div style="display: flex; gap: 8px; margin-bottom: 16px">
            <el-select v-model="searchCategory" placeholder="카테고리" clearable style="width: 160px" @change="handleSearch">
                <el-option v-for="cat in categories" :key="cat.index" :label="cat.name" :value="cat.index" />
            </el-select>
            <el-input v-model="searchText" placeholder="제목 검색" clearable style="width: 240px" @keyup.enter="handleSearch" />
            <el-button @click="handleSearch">검색</el-button>
        </div>
        <el-table :data="items" v-loading="loading" border>
            <el-table-column prop="index" label="번호" width="70" align="center" />
            <el-table-column label="썸네일" width="80" align="center">
                <template #default="{ row }">
                    <el-image v-if="row.thumbnailImage" :src="row.thumbnailImage" style="width: 50px; height: 50px" fit="cover" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="제목" min-width="200">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/content/post-tab/${row.index}`)">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="카테고리" width="120" align="center" />
            <el-table-column label="상태" width="80" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.status === 'VALID' ? 'success' : 'info'" size="small">{{ row.status === 'VALID' ? '활성' : '비활성' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="carmorePostCreatorName" label="작성자" width="100" align="center" />
            <el-table-column prop="registerAdmin" label="등록 어드민" width="120" align="center" />
            <el-table-column prop="registerDatetime" label="등록일" width="170" align="center" />
        </el-table>
        <div style="display: flex; justify-content: center; margin-top: 16px">
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="totalElements"
                layout="prev, pager, next"
                @current-change="handlePageChange"
            />
        </div>
    </PageContainer>
</template>
