<template>
  <div class="page">
    <transition name="banner">
      <div v-if="status.message" class="status-banner" :class="status.type">
        {{ status.message }}
      </div>
    </transition>

    <header class="hero">
      <p class="hero__eyebrow">南京大学 · 智能检索聚合</p>
      <h1>南京大学 RAG 系统</h1>
      <p class="hero__subtitle">
        集中汇聚各院系官网与官方公众号资讯，通过向量检索 + 大模型实时解答你的校内问题。
      </p>
    </header>

    <main>
      <ChatInput v-model="question" :loading="loading" @submit="handleQuery" />

      <section class="answer" v-if="hasAnswer">
        <p class="answer__label fade-stagger">AI 回答</p>
        <TransitionGroup name="line" tag="div" class="answer__content">
          <p
            v-for="(line, index) in answerLines"
            :key="`${line}-${index}`"
            class="answer__line"
            :style="lineDelay(index)"
          >
            {{ line }}
          </p>
        </TransitionGroup>
      </section>

      <RagSources :sources="sources" />
    </main>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from 'axios';
import { TransitionGroup } from 'vue';
import { computed, ref } from 'vue';
import ChatInput from '@/components/ChatInput.vue';
import RagSources from '@/components/RagSources.vue';
import type { RagResponse, RagSource } from '@/types';

const question = ref('');
const answer = ref('');
const sources = ref<RagSource[]>([]);
const loading = ref(false);
const status = ref<{ type: 'success' | 'error' | null; message: string }>({
  type: null,
  message: ''
});

const API_ENDPOINT = import.meta.env.VITE_RAG_API_URL ?? '/api/rag';

const answerLines = computed(() =>
  answer.value
    .split(/\n+/)
    .map((line: string) => line.trim())
    .filter(Boolean)
);

const hasAnswer = computed(() => answerLines.value.length > 0);

const lineDelay = (index: number) => ({
  animationDelay: `${0.15 + index * 0.15}s`
});

const setStatus = (type: 'success' | 'error', message: string) => {
  status.value = { type, message };
  setTimeout(() => {
    status.value = { type: null, message: '' };
  }, 4000);
};

const handleQuery = async () => {
  if (!question.value.trim()) return;

  loading.value = true;
  answer.value = '';
  sources.value = [];
  status.value = { type: null, message: '' };

  try {
    const { data } = await axios.post<RagResponse>(API_ENDPOINT, {
      question: question.value.trim()
    });

    if (data.code === '200') {
      answer.value = data.answer ?? '';
      sources.value = data.sources ?? [];
      setStatus('success', '查询成功，以下为最新结果');
    } else if (data.code === '404') {
      setStatus('error', '未查询到相关信息，请更换关键词');
    } else {
      setStatus('error', '服务暂不可用，请稍后再试');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error as AxiosError<RagResponse>;
      if (response?.data?.code === '404') {
        setStatus('error', '请求成功但未命中相关内容 (404)');
      } else {
        setStatus('error', '无法连接后端服务，请检查 mock 服务是否启动');
      }
    } else {
      setStatus('error', '出现未知错误，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  text-align: center;
  padding: 5vh 1.5rem 1rem;
}

.hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.75rem;
  color: rgba(247, 245, 251, 0.75);
}

.hero h1 {
  font-size: clamp(2.8rem, 7vw, 4rem);
  margin: 0.5rem 0 0;
  color: #fff;
}

.hero__subtitle {
  max-width: 760px;
  margin: 0.75rem auto 0;
  font-size: 1.05rem;
  color: rgba(247, 245, 251, 0.8);
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 4rem;
}

.answer {
  width: min(960px, calc(100% - 2rem));
  margin: 1.5rem auto 0;
}

.answer__label {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: rgba(247, 245, 251, 0.6);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: fadeInSoft 0.8s ease forwards;
}
.fade-stagger:nth-of-type(1) {
  animation-delay: 0.1s;
}

@keyframes fadeInSoft {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.answer__content {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  font-size: 1.05rem;
  line-height: 1.9;
}

.answer__line {
  margin: 0;
  opacity: 0;
  animation: riseUp 0.85s ease forwards;
  animation-fill-mode: forwards;
}

.line-enter-active,
.line-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.line-enter-from,
.line-leave-to {
  opacity: 0;
  transform: translateY(18px);
}

@keyframes riseUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-banner {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(640px, calc(100% - 2rem));
  padding: 0.9rem 1.5rem;
  text-align: center;
  font-weight: 600;
  z-index: 50;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.status-banner.success {
  background: rgba(83, 199, 165, 0.25);
  color: #b7ffe4;
}

.status-banner.error {
  background: rgba(255, 103, 141, 0.25);
  color: #ffd9e4;
}

.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.35s ease;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}
</style>
