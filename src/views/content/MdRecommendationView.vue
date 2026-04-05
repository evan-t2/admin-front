<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mdRecommendationApi, type MdRecommendation } from '@/api/mdRecommendation'

const items = ref<MdRecommendation[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const form = ref({ index: 0, affiliateName: '', description: '' })
const dialogTitle = computed(() => form.value.index ? '수정' : '추가')

async function fetchList() {
    loading.value = true
    try {
        const res: any = await mdRecommendationApi.getList()
        items.value = res.data?.content || res.data || []
    } catch { /* interceptor */ }
    finally { loading.value = false }
}

function openDialog(item?: MdRecommendation) {
    if (item) {
        form.value = { index: item.index, affiliateName: item.affiliateName, description: item.description }
    } else {
        form.value = { index: 0, affiliateName: '', description: '' }
    }
    dialogVisible.value = true
}

async function handleSave() {
    if (!form.value.affiliateName.trim()) {
        ElMessage.warning('제휴사명을 입력해주세요.')
        return
    }
    try {
        if (form.value.index) {
            await mdRecommendationApi.update(form.value.index, { description: form.value.description })
        } else {
            await mdRecommendationApi.create({ affiliateName: form.value.affiliateName, description: form.value.description })
        }
        ElMessage.success('저장되었습니다.')
        dialogVisible.value = false
        fetchList()
    } catch { /* interceptor */ }
}

async function handleDelete(index: number) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try {
        await mdRecommendationApi.delete(index)
        ElMessage.success('삭제되었습니다.')
        fetchList()
    } catch { /* interceptor */ }
}

onMounted(fetchList)
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
            <h2 style="margin: 0">카모아 한마디 (MD 추천)</h2>
            <el-button type="primary" @click="openDialog()">추가</el-button>
        </div>
        <el-table :data="items" v-loading="loading" border>
            <el-table-column prop="order" label="순서" width="70" align="center" />
            <el-table-column prop="affiliateName" label="제휴사명" width="200" />
            <el-table-column prop="description" label="한마디" min-width="300" />
            <el-table-column prop="createdAt" label="등록일" width="170" align="center" />
            <el-table-column label="관리" width="140" align="center">
                <template #default="{ row }">
                    <el-button text size="small" @click="openDialog(row)">수정</el-button>
                    <el-button text size="small" type="danger" @click="handleDelete(row.index)">삭제</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
            <el-form label-width="80px">
                <el-form-item label="제휴사명">
                    <el-input v-model="form.affiliateName" :disabled="!!form.index" />
                </el-form-item>
                <el-form-item label="한마디">
                    <el-input v-model="form.description" type="textarea" :rows="3" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">취소</el-button>
                <el-button type="primary" @click="handleSave">저장</el-button>
            </template>
        </el-dialog>
    </div>
</template>
