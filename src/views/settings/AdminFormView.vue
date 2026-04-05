<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'
import { teamApi, type Team } from '@/api/team'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const teams = ref<Team[]>([])
const adminIdx = computed(() => route.params.adminIdx ? Number(route.params.adminIdx) : null)
const isEdit = computed(() => !!adminIdx.value)
const pageTitle = computed(() => isEdit.value ? '관리자 수정' : '관리자 추가')

const form = ref({ adminName: '', adminEmail: '', adminPwd: '', adminTel: '', teamCode: '', adminType: 1, adminStats: 'y', memberGrade: '' })

async function fetchTeams() { try { const res: any = await teamApi.getList(); teams.value = res.data } catch {} }

async function fetchAdmin() {
    if (!adminIdx.value) return
    loading.value = true
    try {
        const res: any = await adminApi.getOne(adminIdx.value)
        const a = res.data
        form.value = { adminName: a.adminName, adminEmail: a.adminEmail, adminPwd: '', adminTel: a.adminTel || '', teamCode: a.teamCode || '', adminType: a.adminType, adminStats: a.adminStats, memberGrade: a.memberGrade || '' }
    } catch { router.push('/settings/admins') }
    finally { loading.value = false }
}

async function handleSubmit() {
    if (!form.value.adminName.trim() || !form.value.adminEmail.trim()) { ElMessage.warning('이름과 이메일을 입력해주세요.'); return }
    saving.value = true
    try {
        if (isEdit.value) { await adminApi.update(adminIdx.value!, form.value); ElMessage.success('수정되었습니다.') }
        else { if (!form.value.adminPwd) { ElMessage.warning('비밀번호를 입력해주세요.'); saving.value = false; return }; await adminApi.create(form.value); ElMessage.success('등록되었습니다.') }
        router.push('/settings/admins')
    } catch {} finally { saving.value = false }
}

onMounted(() => { fetchTeams(); fetchAdmin() })
</script>

<template>
    <PageContainer :title="pageTitle">
        <div v-loading="loading" style="display: flex; justify-content: center">
            <el-card style="width: 600px">
                <el-form label-width="120px" label-position="left">
                    <el-form-item label="이름"><el-input v-model="form.adminName" /></el-form-item>
                    <el-form-item label="이메일"><el-input v-model="form.adminEmail" :disabled="isEdit" /></el-form-item>
                    <el-form-item :label="isEdit ? '비밀번호 변경' : '비밀번호'"><el-input v-model="form.adminPwd" type="password" show-password :placeholder="isEdit ? '변경 시에만 입력' : '비밀번호'" /></el-form-item>
                    <el-form-item label="전화번호"><el-input v-model="form.adminTel" /></el-form-item>
                    <el-form-item label="팀"><el-select v-model="form.teamCode" style="width: 100%"><el-option v-for="t in teams" :key="t.teamCode" :label="t.teamName" :value="t.teamCode" /></el-select></el-form-item>
                    <el-form-item label="등급"><el-select v-model="form.adminType" style="width: 100%"><el-option label="일반" :value="1" /><el-option label="마스터" :value="50" /><el-option label="최고마스터" :value="100" /></el-select></el-form-item>
                    <el-form-item label="상태"><el-radio-group v-model="form.adminStats"><el-radio value="y">활성</el-radio><el-radio value="n">비활성</el-radio></el-radio-group></el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="saving" @click="handleSubmit">{{ isEdit ? '수정' : '등록' }}</el-button>
                        <el-button @click="router.push('/settings/admins')">취소</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </PageContainer>
</template>
