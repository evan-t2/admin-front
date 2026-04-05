<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { noticeApi, type Notice } from '@/api/notice'
import PageContainer from '@/components/PageContainer.vue'

const router = useRouter()
const notices = ref<Notice[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

async function fetchNotices() {
    loading.value = true
    try { const res: any = await noticeApi.getList(); notices.value = res.data }
    catch { ElMessage.error('공지사항 목록을 불러오지 못했습니다.') }
    finally { loading.value = false }
}

function handleSelectionChange(rows: Notice[]) { selectedIds.value = rows.map((r) => r.index) }

async function handleDelete(index: number) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try { await noticeApi.delete(index); ElMessage.success('삭제되었습니다.'); fetchNotices() } catch {}
}

async function handleBatchStatus(isShowing: boolean) {
    if (selectedIds.value.length === 0) { ElMessage.warning('선택된 항목이 없습니다.'); return }
    try { await noticeApi.updateStatus(selectedIds.value, isShowing); ElMessage.success('상태가 변경되었습니다.'); fetchNotices() } catch {}
}

onMounted(fetchNotices)
</script>

<template>
    <PageContainer title="공지사항 관리">
        <template #actions>
            <div style="display: flex; gap: 8px">
                <el-button @click="handleBatchStatus(true)">선택 노출</el-button>
                <el-button @click="handleBatchStatus(false)">선택 숨김</el-button>
                <el-button type="primary" @click="router.push('/notice/create')">공지 등록</el-button>
            </div>
        </template>
        <el-table :data="notices" v-loading="loading" @selection-change="handleSelectionChange" border>
            <el-table-column type="selection" width="50" />
            <el-table-column prop="order" label="순서" width="70" align="center" />
            <el-table-column prop="title" label="제목" min-width="200">
                <template #default="{ row }"><el-link type="primary" @click="router.push(`/notice/${row.index}`)">{{ row.title }}</el-link></template>
            </el-table-column>
            <el-table-column prop="exposurePage" label="노출 페이지" width="120" align="center" />
            <el-table-column label="상태" width="80" align="center">
                <template #default="{ row }"><el-tag :type="row.isShowing ? 'success' : 'info'" size="small">{{ row.isShowing ? 'ON' : 'OFF' }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="registerDatetime" label="등록일" width="170" align="center" />
            <el-table-column label="관리" width="100" align="center">
                <template #default="{ row }"><el-button type="danger" size="small" text @click="handleDelete(row.index)">삭제</el-button></template>
            </el-table-column>
        </el-table>
    </PageContainer>
</template>
