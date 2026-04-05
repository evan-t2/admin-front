<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
    if (!email.value || !password.value) {
        ElMessage.warning('아이디와 비밀번호를 입력해주세요.')
        return
    }
    loading.value = true
    try {
        await auth.login(email.value, password.value)
    } catch {
        ElMessage.error('로그인에 실패했습니다.')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5">
        <el-card style="width: 400px">
            <template #header>
                <div style="text-align: center; font-size: 20px; font-weight: bold">CarMore Admin</div>
            </template>
            <el-form @submit.prevent="handleLogin">
                <el-form-item>
                    <el-input v-model="email" placeholder="이메일" prefix-icon="User" size="large" />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="password"
                        type="password"
                        placeholder="비밀번호"
                        prefix-icon="Lock"
                        size="large"
                        show-password
                    />
                </el-form-item>
                <el-button type="primary" native-type="submit" :loading="loading" size="large" style="width: 100%">
                    로그인
                </el-button>
            </el-form>
        </el-card>
    </div>
</template>
