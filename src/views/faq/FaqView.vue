<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { faqCategoryApi, faqQuestionApi, type FaqCategory, type FaqQuestion } from '@/api/faq'

const activeTab = ref('questions')
const categories = ref<FaqCategory[]>([])
const questions = ref<FaqQuestion[]>([])
const loading = ref(false)
const selectedCategory = ref<number | undefined>(undefined)

const categoryDialogVisible = ref(false)
const categoryForm = ref({ index: 0, parentIndex: 0, name: '', status: 'ON' })
const categoryFormTitle = computed(() => categoryForm.value.index ? '카테고리 수정' : '카테고리 추가')

const questionDialogVisible = ref(false)
const questionForm = ref({ index: 0, categoryIndex: 0, title: '', content: '', status: 'ON' })
const questionFormTitle = computed(() => questionForm.value.index ? '질문 수정' : '질문 추가')

const flatCategories = computed(() => {
    const result: { index: number; name: string; depth: number }[] = []
    for (const root of categories.value) {
        result.push({ index: root.index, name: root.name, depth: 0 })
        for (const child of root.children || []) {
            result.push({ index: child.index, name: child.name, depth: 1 })
        }
    }
    return result
})

async function fetchCategories() {
    try {
        const res: any = await faqCategoryApi.getList()
        categories.value = res.data
    } catch { /* interceptor */ }
}

async function fetchQuestions() {
    loading.value = true
    try {
        const res: any = await faqQuestionApi.getList(selectedCategory.value)
        questions.value = res.data
    } catch { /* interceptor */ }
    finally { loading.value = false }
}

function openCategoryDialog(parent?: FaqCategory, edit?: FaqCategory) {
    if (edit) {
        categoryForm.value = { index: edit.index, parentIndex: edit.parentIndex, name: edit.name, status: edit.status }
    } else {
        categoryForm.value = { index: 0, parentIndex: parent ? parent.index : 0, name: '', status: 'ON' }
    }
    categoryDialogVisible.value = true
}

async function saveCategory() {
    if (!categoryForm.value.name.trim()) { ElMessage.warning('카테고리 이름을 입력해주세요.'); return }
    try {
        if (categoryForm.value.index) {
            await faqCategoryApi.update(categoryForm.value.index, { name: categoryForm.value.name, status: categoryForm.value.status })
        } else {
            await faqCategoryApi.create({ parentIndex: categoryForm.value.parentIndex, name: categoryForm.value.name, status: categoryForm.value.status })
        }
        ElMessage.success('저장되었습니다.')
        categoryDialogVisible.value = false
        fetchCategories()
    } catch { /* interceptor */ }
}

async function deleteCategory(index: number) {
    await ElMessageBox.confirm('하위 카테고리와 질문도 모두 삭제됩니다. 삭제하시겠습니까?', '확인')
    try {
        await faqCategoryApi.delete(index)
        ElMessage.success('삭제되었습니다.')
        fetchCategories()
        fetchQuestions()
    } catch { /* interceptor */ }
}

function openQuestionDialog(edit?: FaqQuestion) {
    if (edit) {
        questionForm.value = { index: edit.index, categoryIndex: edit.categoryIndex, title: edit.title, content: edit.content, status: edit.status }
    } else {
        questionForm.value = { index: 0, categoryIndex: flatCategories.value[0]?.index || 0, title: '', content: '', status: 'ON' }
    }
    questionDialogVisible.value = true
}

async function saveQuestion() {
    if (!questionForm.value.title.trim()) { ElMessage.warning('제목을 입력해주세요.'); return }
    try {
        if (questionForm.value.index) {
            await faqQuestionApi.update(questionForm.value.index, { categoryIndex: questionForm.value.categoryIndex, title: questionForm.value.title, content: questionForm.value.content, status: questionForm.value.status })
        } else {
            await faqQuestionApi.create({ categoryIndex: questionForm.value.categoryIndex, title: questionForm.value.title, content: questionForm.value.content, status: questionForm.value.status })
        }
        ElMessage.success('저장되었습니다.')
        questionDialogVisible.value = false
        fetchQuestions()
    } catch { /* interceptor */ }
}

async function deleteQuestion(index: number) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try {
        await faqQuestionApi.delete(index)
        ElMessage.success('삭제되었습니다.')
        fetchQuestions()
    } catch { /* interceptor */ }
}

onMounted(() => { fetchCategories(); fetchQuestions() })
</script>

<template>
    <div>
        <h2 style="margin-bottom: 16px">자주 묻는 질문 관리</h2>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="카테고리 관리" name="categories">
                <div style="margin-bottom: 12px">
                    <el-button type="primary" size="small" @click="openCategoryDialog()">루트 카테고리 추가</el-button>
                </div>
                <el-tree :data="categories" node-key="index" :props="{ label: 'name', children: 'children' }" default-expand-all>
                    <template #default="{ data }">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
                            <span>{{ data.name }} <el-tag :type="data.status === 'ON' ? 'success' : 'info'" size="small" style="margin-left: 8px">{{ data.status }}</el-tag></span>
                            <span>
                                <el-button v-if="data.parentIndex === 0" text size="small" @click.stop="openCategoryDialog(data)">하위 추가</el-button>
                                <el-button text size="small" @click.stop="openCategoryDialog(undefined, data)">수정</el-button>
                                <el-button text size="small" type="danger" @click.stop="deleteCategory(data.index)">삭제</el-button>
                            </span>
                        </div>
                    </template>
                </el-tree>
            </el-tab-pane>
            <el-tab-pane label="질문 관리" name="questions">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px">
                    <el-select v-model="selectedCategory" placeholder="카테고리 필터" clearable @change="fetchQuestions" style="width: 240px">
                        <el-option v-for="c in flatCategories" :key="c.index" :label="(c.depth ? '  └ ' : '') + c.name" :value="c.index" />
                    </el-select>
                    <el-button type="primary" size="small" @click="openQuestionDialog()">질문 추가</el-button>
                </div>
                <el-table :data="questions" v-loading="loading" border>
                    <el-table-column prop="parentCategoryName" label="상위 카테고리" width="140" align="center" />
                    <el-table-column prop="categoryName" label="카테고리" width="140" align="center" />
                    <el-table-column prop="title" label="제목" min-width="200" />
                    <el-table-column label="상태" width="80" align="center">
                        <template #default="{ row }"><el-tag :type="row.status === 'ON' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag></template>
                    </el-table-column>
                    <el-table-column prop="order" label="순서" width="70" align="center" />
                    <el-table-column label="관리" width="140" align="center">
                        <template #default="{ row }">
                            <el-button text size="small" @click="openQuestionDialog(row)">수정</el-button>
                            <el-button text size="small" type="danger" @click="deleteQuestion(row.index)">삭제</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-model="categoryDialogVisible" :title="categoryFormTitle" width="400px">
            <el-form label-width="80px">
                <el-form-item label="이름"><el-input v-model="categoryForm.name" /></el-form-item>
                <el-form-item label="상태">
                    <el-radio-group v-model="categoryForm.status"><el-radio value="ON">ON</el-radio><el-radio value="OFF">OFF</el-radio></el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer><el-button @click="categoryDialogVisible = false">취소</el-button><el-button type="primary" @click="saveCategory">저장</el-button></template>
        </el-dialog>
        <el-dialog v-model="questionDialogVisible" :title="questionFormTitle" width="600px">
            <el-form label-width="80px">
                <el-form-item label="카테고리">
                    <el-select v-model="questionForm.categoryIndex" style="width: 100%">
                        <el-option v-for="c in flatCategories" :key="c.index" :label="(c.depth ? '  └ ' : '') + c.name" :value="c.index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="제목"><el-input v-model="questionForm.title" /></el-form-item>
                <el-form-item label="내용"><el-input v-model="questionForm.content" type="textarea" :rows="6" /></el-form-item>
                <el-form-item label="상태">
                    <el-radio-group v-model="questionForm.status"><el-radio value="ON">ON</el-radio><el-radio value="OFF">OFF</el-radio></el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer><el-button @click="questionDialogVisible = false">취소</el-button><el-button type="primary" @click="saveQuestion">저장</el-button></template>
        </el-dialog>
    </div>
</template>
