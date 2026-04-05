<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh">
        <el-icon style="font-size: 64px; color: #e6a23c; margin-bottom: 16px"><WarningFilled /></el-icon>
        <h2 style="margin-bottom: 8px">접근 권한이 없습니다</h2>
        <p style="color: #999; margin-bottom: 24px">해당 페이지에 대한 접근 권한이 없습니다. 관리자에게 문의해주세요.</p>
        <el-button type="primary" @click="router.push('/dashboard')">대시보드로 이동</el-button>
    </div>
</template>
