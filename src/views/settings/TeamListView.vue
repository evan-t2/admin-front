<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { teamApi, type Team } from '@/api/team'
import PageContainer from '@/components/PageContainer.vue'

const teams = ref<Team[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const form = ref({ teamCode: '', teamName: '' })
const editingCode = ref<string | null>(null)
const dialogTitle = computed(() => editingCode.value ? '팀 수정' : '팀 추가')

async function fetchTeams() {
    loading.value = true
    try { const res: any = await teamApi.getList(); teams.value = res.data } catch {}
    finally { loading.value = false }
}

function openDialog(team?: Team) {
    if (team) { editingCode.value = team.teamCode; form.value = { teamCode: team.teamCode, teamName: team.teamName } }
    else { editingCode.value = null; form.value = { teamCode: '', teamName: '' } }
    dialogVisible.value = true
}

async function handleSave() {
    if (!form.value.teamCode.trim() || !form.value.teamName.trim()) { ElMessage.warning('모든 항목을 입력해주세요.'); return }
    try {
        if (editingCode.value) { await teamApi.update(editingCode.value, { teamName: form.value.teamName }) }
        else { await teamApi.create(form.value) }
        ElMessage.success('저장되었습니다.'); dialogVisible.value = false; fetchTeams()
    } catch {}
}

async function handleDelete(teamCode: string) {
    await ElMessageBox.confirm('삭제하시겠습니까?', '확인')
    try { await teamApi.delete(teamCode); ElMessage.success('삭제되었습니다.'); fetchTeams() } catch {}
}

onMounted(fetchTeams)
</script>

<template>
    <PageContainer title="팀정보 관리">
        <template #actions><el-button type="primary" @click="openDialog()">팀 추가</el-button></template>
        <el-table :data="teams" v-loading="loading" border>
            <el-table-column prop="teamCode" label="팀 코드" width="200" />
            <el-table-column prop="teamName" label="팀 이름" min-width="200" />
            <el-table-column prop="memberCount" label="멤버 수" width="100" align="center" />
            <el-table-column label="관리" width="160" align="center">
                <template #default="{ row }">
                    <el-button text size="small" @click="openDialog(row)">수정</el-button>
                    <el-button text size="small" type="danger" @click="handleDelete(row.teamCode)">삭제</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
            <el-form label-width="80px">
                <el-form-item label="팀 코드"><el-input v-model="form.teamCode" :disabled="!!editingCode" /></el-form-item>
                <el-form-item label="팀 이름"><el-input v-model="form.teamName" /></el-form-item>
            </el-form>
            <template #footer><el-button @click="dialogVisible = false">취소</el-button><el-button type="primary" @click="handleSave">저장</el-button></template>
        </el-dialog>
    </PageContainer>
</template>
