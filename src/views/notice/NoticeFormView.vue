<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { noticeApi, type Notice } from '@/api/notice'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)

const index = computed(() => route.params.index ? Number(route.params.index) : null)
const isEdit = computed(() => !!index.value)

const form = ref({ title: '', exposurePage: '', description: '', content: '', isShowing: true })

async function fetchNotice() {
    if (!index.value) return
    loading.value = true
    try {
        const res: any = await noticeApi.getOne(index.value)
        const notice: Notice = res.data
        form.value = { title: notice.title, exposurePage: notice.exposurePage, description: notice.description, content: notice.content, isShowing: notice.isShowing }
    } catch {
        ElMessage.error('공지사항을 불러오지 못했습니다.')
        router.push('/notice')
    } finally { loading.value = false }
}

async function handleSubmit() {
    if (!form.value.title.trim()) { ElMessage.warning('제목을 입력해주세요.'); return }
    saving.value = true
    try {
        if (isEdit.value) {
            await noticeApi.update(index.value!, form.value)
            ElMessage.success('수정되었습니다.')
        } else {
            await noticeApi.create(form.value)
            ElMessage.success('등록되었습니다.')
        }
        router.push('/notice')
    } catch { /* interceptor */ }
    finally { saving.value = false }
}

onMounted(fetchNotice)
</script>

<template>
    <PageContainer v-loading="loading">
        <h2 style="margin-bottom: 16px">{{ isEdit ? '공지사항 수정' : '공지사항 등록' }}</h2>
        <div style="display: flex; justify-content: center">
            <el-card style="width: 700px">
                <el-form label-width="120px" label-position="left">
                    <el-form-item label="제목"><el-input v-model="form.title" placeholder="제목을 입력하세요" /></el-form-item>
                    <el-form-item label="노출 페이지"><el-input v-model="form.exposurePage" placeholder="노출 페이지" /></el-form-item>
                    <el-form-item label="설명"><el-input v-model="form.description" type="textarea" :rows="2" placeholder="설명을 입력하세요" /></el-form-item>
                    <el-form-item label="내용"><el-input v-model="form.content" type="textarea" :rows="10" placeholder="내용을 입력하세요" /></el-form-item>
                    <el-form-item label="노출 여부"><el-switch v-model="form.isShowing" active-text="ON" inactive-text="OFF" /></el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="saving" @click="handleSubmit">{{ isEdit ? '수정' : '등록' }}</el-button>
                        <el-button @click="router.push('/notice')">취소</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </PageContainer>
</template>
