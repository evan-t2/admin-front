<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi, type Admin } from '@/api/admin'
import { useRouter } from 'vue-router'

const router = useRouter()
const admins = ref<Admin[]>([])
const loading = ref(false)

async function fetchAdmins() {
    loading.value = true
    try {
        const res: any = await adminApi.getList()
        admins.value = res.data
    } catch { /* interceptor */ }
    finally { loading.value = false }
}

async function handleDelete(adminIdx: number) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try {
        await adminApi.delete(adminIdx)
        ElMessage.success('삭제되었습니다.')
        fetchAdmins()
    } catch { /* interceptor */ }
}

function getTypeName(type: number) {
    if (type >= 100) return '최고마스터'
    if (type >= 50) return '마스터'
    return '일반'
}

onMounted(fetchAdmins)
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
            <h2 style="margin: 0">관리자 관리</h2>
            <el-button type="primary" @click="router.push('/settings/admins/create')">관리자 추가</el-button>
        </div>
        <el-table :data="admins" v-loading="loading" border>
            <el-table-column prop="adminIdx" label="번호" width="70" align="center" />
            <el-table-column prop="adminName" label="이름" width="120" />
            <el-table-column prop="adminEmail" label="이메일" min-width="200" />
            <el-table-column prop="teamName" label="팀" width="120" align="center" />
            <el-table-column label="등급" width="100" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.adminType >= 50 ? 'danger' : 'info'" size="small">
                        {{ getTypeName(row.adminType) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="상태" width="80" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.adminStats === 'y' ? 'success' : 'info'" size="small">
                        {{ row.adminStats === 'y' ? '활성' : '비활성' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="관리" width="160" align="center">
                <template #default="{ row }">
                    <el-button text size="small" @click="router.push(`/settings/admins/${row.adminIdx}`)">수정</el-button>
                    <el-button text size="small" type="danger" @click="handleDelete(row.adminIdx)">삭제</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
