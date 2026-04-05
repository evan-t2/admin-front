<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'
import PageContainer from '@/components/PageContainer.vue'

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
})
const saving = ref(false)

async function handleSubmit() {
    if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
        ElMessage.warning('모든 항목을 입력해주세요.')
        return
    }
    saving.value = true
    try {
        await api.put('/api/auth/password', form.value)
        ElMessage.success('비밀번호가 변경되었습니다.')
        form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    } catch {
        // error handled by interceptor
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <PageContainer>
        <h2 style="margin-bottom: 16px">비밀번호 변경</h2>
        <div style="display: flex; justify-content: center">
            <el-card style="width: 500px">
                <el-form label-width="140px" label-position="left">
                    <el-form-item label="현재 비밀번호">
                        <el-input v-model="form.oldPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="신규 비밀번호">
                        <el-input v-model="form.newPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="신규 비밀번호 확인">
                        <el-input v-model="form.confirmPassword" type="password" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="saving" @click="handleSubmit">변경</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </PageContainer>
</template>
