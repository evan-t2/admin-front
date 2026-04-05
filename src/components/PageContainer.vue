<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">{{ title }}</h2>
            <div class="page-header-actions">
                <slot name="actions" />
            </div>
        </div>
        <el-divider style="margin: 16px 0" />
        <div class="page-content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-title {
    margin: 0;
    font-size: 20px;
}

.page-content {
    margin-top: 0;
}
</style>
