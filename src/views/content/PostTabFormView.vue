<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { postTabApi, type Post, type PostCategory, type SavePostRequest } from '@/api/postTab'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const categories = ref<PostCategory[]>([])
const index = computed(() => route.params.index ? Number(route.params.index) : null)
const isEdit = computed(() => !!index.value)
const pageTitle = computed(() => isEdit.value ? '포스트 수정' : '포스트 등록')

const form = ref({
    title: '',
    description: '',
    thumbnailImage: '',
    categoryIndex: null as number | null,
    isCommentAvailable: 0,
    status: 'VALID',
    html: '',
    markdown: '',
    carmorePostCreatorName: '',
    seoTitle: '',
    seoDescription: '',
})

async function fetchCategories() {
    try { const res: any = await postTabApi.getCategories(); categories.value = res.data || [] } catch {}
}

async function fetchPost() {
    if (!index.value) return
    loading.value = true
    try {
        const res: any = await postTabApi.getOne(index.value)
        const p: Post = res.data
        form.value = {
            title: p.title,
            description: p.description || '',
            thumbnailImage: p.thumbnailImage || '',
            categoryIndex: p.categoryIndex,
            isCommentAvailable: p.isCommentAvailable,
            status: p.status,
            html: p.html || '',
            markdown: p.markdown || '',
            carmorePostCreatorName: p.carmorePostCreatorName,
            seoTitle: p.seoTitle || '',
            seoDescription: p.seoDescription || '',
        }
    } catch { ElMessage.error('포스트를 불러오지 못했습니다.'); router.push('/content/post-tab') }
    finally { loading.value = false }
}

async function handleSubmit() {
    if (!form.value.title.trim()) { ElMessage.warning('제목을 입력해주세요.'); return }
    if (!form.value.categoryIndex) { ElMessage.warning('카테고리를 선택해주세요.'); return }
    if (!form.value.carmorePostCreatorName.trim()) { ElMessage.warning('작성자명을 입력해주세요.'); return }

    const data: SavePostRequest = {
        title: form.value.title,
        description: form.value.description,
        thumbnailImage: form.value.thumbnailImage,
        categoryIndex: form.value.categoryIndex,
        isCommentAvailable: form.value.isCommentAvailable,
        status: form.value.status,
        html: form.value.html,
        markdown: form.value.markdown,
        carmorePostCreatorName: form.value.carmorePostCreatorName,
        seoTitle: form.value.seoTitle,
        seoDescription: form.value.seoDescription,
    }

    saving.value = true
    try {
        if (isEdit.value) { await postTabApi.update(index.value!, data); ElMessage.success('수정되었습니다.') }
        else { await postTabApi.create(data); ElMessage.success('등록되었습니다.') }
        router.push('/content/post-tab')
    } catch {}
    finally { saving.value = false }
}

onMounted(() => { fetchCategories(); fetchPost() })
</script>

<template>
    <PageContainer :title="pageTitle">
        <div v-loading="loading" style="display: flex; justify-content: center">
            <el-card style="width: 800px">
                <el-form label-width="140px" label-position="left">
                    <el-form-item label="제목"><el-input v-model="form.title" placeholder="제목을 입력하세요" /></el-form-item>
                    <el-form-item label="카테고리">
                        <el-select v-model="form.categoryIndex" placeholder="카테고리 선택">
                            <el-option v-for="cat in categories" :key="cat.index" :label="cat.name" :value="cat.index" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="작성자명"><el-input v-model="form.carmorePostCreatorName" placeholder="작성자명" /></el-form-item>
                    <el-form-item label="설명"><el-input v-model="form.description" type="textarea" :rows="2" placeholder="설명을 입력하세요" /></el-form-item>
                    <el-form-item label="썸네일 이미지"><el-input v-model="form.thumbnailImage" placeholder="이미지 URL" /></el-form-item>
                    <el-form-item label="상태">
                        <el-select v-model="form.status">
                            <el-option label="활성" value="VALID" />
                            <el-option label="비활성" value="INVALID" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="댓글 허용">
                        <el-switch v-model="form.isCommentAvailable" :active-value="1" :inactive-value="0" active-text="허용" inactive-text="비허용" />
                    </el-form-item>
                    <el-form-item label="HTML"><el-input v-model="form.html" type="textarea" :rows="10" placeholder="HTML 내용" /></el-form-item>
                    <el-form-item label="Markdown"><el-input v-model="form.markdown" type="textarea" :rows="10" placeholder="Markdown 내용" /></el-form-item>
                    <el-form-item label="SEO 제목"><el-input v-model="form.seoTitle" placeholder="SEO 제목" /></el-form-item>
                    <el-form-item label="SEO 설명"><el-input v-model="form.seoDescription" type="textarea" :rows="2" placeholder="SEO 설명" /></el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="saving" @click="handleSubmit">{{ isEdit ? '수정' : '등록' }}</el-button>
                        <el-button @click="router.push('/content/post-tab')">취소</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </PageContainer>
</template>
