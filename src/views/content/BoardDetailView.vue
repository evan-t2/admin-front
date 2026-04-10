<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { boardApi, type Board } from '@/api/board'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const board = ref<Board | null>(null)
const newComment = ref('')
const commentLoading = ref(false)
const index = computed(() => Number(route.params.index))

async function fetchBoard() {
    loading.value = true
    try {
        const res: any = await boardApi.getOne(index.value)
        board.value = res.data
    } catch { ElMessage.error('게시글을 불러오지 못했습니다.'); router.push('/content/board') }
    finally { loading.value = false }
}

async function handleAddComment() {
    if (!newComment.value.trim()) { ElMessage.warning('댓글을 입력해주세요.'); return }
    commentLoading.value = true
    try {
        await boardApi.createComment({ boardIndex: index.value, commentText: newComment.value })
        newComment.value = ''
        ElMessage.success('댓글이 등록되었습니다.')
        fetchBoard()
    } catch {}
    finally { commentLoading.value = false }
}

async function handleDeleteComment(commentIndex: number) {
    await ElMessageBox.confirm('댓글을 삭제하시겠습니까?', '확인')
    try { await boardApi.deleteComment(commentIndex); ElMessage.success('삭제되었습니다.'); fetchBoard() } catch {}
}

async function handleChangeStats(stats: string) {
    try { await boardApi.changeStats(index.value, stats); ElMessage.success('상태가 변경되었습니다.'); fetchBoard() } catch {}
}

async function handleDelete() {
    await ElMessageBox.confirm('게시글을 삭제하시겠습니까?', '확인')
    try { await boardApi.delete(index.value); ElMessage.success('삭제되었습니다.'); router.push('/content/board') } catch {}
}

onMounted(fetchBoard)
</script>

<template>
    <PageContainer title="게시글 상세">
        <div v-loading="loading" v-if="board">
            <el-row :gutter="20">
                <!-- 게시글 -->
                <el-col :span="16">
                    <el-card>
                        <template #header>
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span style="font-size: 18px; font-weight: bold">{{ board.title }}</span>
                                <div style="display: flex; gap: 8px">
                                    <el-tag :type="board.stats === 'y' ? 'success' : 'danger'" size="small" style="cursor: pointer"
                                            @click="handleChangeStats(board.stats === 'y' ? 'n' : 'y')">
                                        {{ board.stats === 'y' ? '처리완료' : '처리대기' }}
                                    </el-tag>
                                    <el-button size="small" @click="router.push(`/content/board/${board.index}/edit`)">수정</el-button>
                                    <el-button size="small" type="danger" @click="handleDelete">삭제</el-button>
                                </div>
                            </div>
                        </template>
                        <div style="margin-bottom: 12px; color: #909399; font-size: 13px">
                            <span>작성자: {{ board.memId }}</span>
                            <span style="margin-left: 16px">등록일: {{ board.regdate }}</span>
                            <span v-if="board.boardPart" style="margin-left: 16px">카테고리: {{ board.boardPart }}</span>
                        </div>
                        <div style="min-height: 200px; white-space: pre-wrap" v-html="board.content"></div>
                    </el-card>
                </el-col>
                <!-- 댓글 -->
                <el-col :span="8">
                    <el-card header="댓글">
                        <div v-if="board.comments.length === 0" style="color: #909399; text-align: center; padding: 20px">댓글이 없습니다.</div>
                        <div v-for="comment in board.comments" :key="comment.index" style="border-bottom: 1px solid #ebeef5; padding: 10px 0">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span style="font-size: 13px; color: #606266; font-weight: bold">{{ comment.memId }}</span>
                                <div>
                                    <span style="font-size: 12px; color: #909399; margin-right: 8px">{{ comment.regdate }}</span>
                                    <el-button size="small" type="danger" text @click="handleDeleteComment(comment.index)">삭제</el-button>
                                </div>
                            </div>
                            <div style="margin-top: 6px; font-size: 14px">{{ comment.commentText }}</div>
                        </div>
                        <div style="margin-top: 12px; display: flex; gap: 8px">
                            <el-input v-model="newComment" placeholder="댓글 입력" @keyup.enter="handleAddComment" />
                            <el-button type="primary" :loading="commentLoading" @click="handleAddComment">등록</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div style="margin-top: 16px">
                <el-button @click="router.push('/content/board')">목록으로</el-button>
            </div>
        </div>
    </PageContainer>
</template>
