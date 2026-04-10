<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { boardApi, type Board } from '@/api/board'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const index = computed(() => route.params.index ? Number(route.params.index) : null)
const isEdit = computed(() => !!index.value)
const pageTitle = computed(() => isEdit.value ? '게시글 수정' : '게시글 등록')

const form = ref({
    title: '',
    content: '',
    boardPart: '',
    usrSerial: null as number | null,
    startDate: '',
    endDate: '',
})

async function fetchBoard() {
    if (!index.value) return
    loading.value = true
    try {
        const res: any = await boardApi.getOne(index.value)
        const b: Board = res.data
        form.value = {
            title: b.title || '',
            content: b.content || '',
            boardPart: b.boardPart || '',
            usrSerial: b.usrSerial,
            startDate: '',
            endDate: '',
        }
    } catch { ElMessage.error('게시글을 불러오지 못했습니다.'); router.push('/content/board') }
    finally { loading.value = false }
}

async function handleSubmit() {
    if (!form.value.title.trim()) { ElMessage.warning('제목을 입력해주세요.'); return }
    saving.value = true
    try {
        if (isEdit.value) { await boardApi.update(index.value!, form.value); ElMessage.success('수정되었습니다.') }
        else { await boardApi.create(form.value); ElMessage.success('등록되었습니다.') }
        router.push('/content/board')
    } catch {}
    finally { saving.value = false }
}

onMounted(fetchBoard)
</script>

<template>
    <PageContainer :title="pageTitle">
        <div v-loading="loading" style="display: flex; justify-content: center">
            <el-card style="width: 700px">
                <el-form label-width="120px" label-position="left">
                    <el-form-item label="제목"><el-input v-model="form.title" placeholder="제목을 입력하세요" /></el-form-item>
                    <el-form-item label="카테고리">
                        <el-select v-model="form.boardPart" placeholder="카테고리 선택" clearable>
                            <el-option label="회원" value="member" />
                            <el-option label="포인트" value="point" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="내용"><el-input v-model="form.content" type="textarea" :rows="10" placeholder="내용을 입력하세요" /></el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="saving" @click="handleSubmit">{{ isEdit ? '수정' : '등록' }}</el-button>
                        <el-button @click="router.push('/content/board')">취소</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </PageContainer>
</template>
