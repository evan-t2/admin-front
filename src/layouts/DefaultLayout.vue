<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const menuItems = [
    { title: '대시보드', icon: 'DataBoard', path: '/' },
    { title: '공지사항', icon: 'Bell', path: '/notice' },
    { title: 'FAQ', icon: 'QuestionFilled', path: '/faq' },
]
</script>

<template>
    <el-container style="height: 100vh">
        <el-aside width="220px" style="background: #001529">
            <div style="padding: 20px; text-align: center; color: #fff; font-size: 18px; font-weight: bold">
                CarMore Admin
            </div>
            <el-menu
                :default-active="$route.path"
                router
                background-color="#001529"
                text-color="#ffffffb3"
                active-text-color="#fff"
            >
                <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header style="display: flex; align-items: center; justify-content: flex-end; border-bottom: 1px solid #eee">
                <el-button text @click="auth.logout">로그아웃</el-button>
            </el-header>

            <el-main style="background: #f5f5f5">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
