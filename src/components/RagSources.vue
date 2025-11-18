<template>
  <div class="sources" v-if="sources.length">
    <h3 class="sources__title fade-stagger">信息来源</h3>
    <div class="sources__grid">
      <article
        v-for="(source, index) in sources"
        :key="source.url"
        class="source-card"
        :style="cardDelay(index)"
      >
        <div class="source-card__header">
          <p class="source-card__title">{{ source.title }}</p>
          <span class="source-card__url">{{ hostname(source.url) }}</span>
        </div>
        <p class="source-card__preview">
          {{ source.text }}
        </p>
        <a class="source-card__link" :href="source.url" target="_blank" rel="noreferrer noopener">
          查看原文 ↗
        </a>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RagSource } from '@/types';

const props = defineProps<{ sources: RagSource[] }>();

const cardDelay = (index: number) => ({
  animationDelay: `${0.35 + index * 0.2}s`
});

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (error) {
    console.warn('Invalid URL in source', error);
    return '未知来源';
  }
};
</script>

<style scoped>
.sources {
  width: min(960px, calc(100% - 2rem));
  margin: 2rem auto 4rem;
}

.sources__title {
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  color: rgba(247, 245, 251, 0.9);
  margin-bottom: 1rem;
  opacity: 0;
  animation: riseSoft 0.9s ease forwards;
}

.sources__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.source-card {
  padding: 1.5rem;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 220px;
  opacity: 0;
  transform: translateY(16px);
  animation: cardFade 0.9s ease forwards;
}

.source-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.source-card__title {
  font-weight: 600;
  font-size: 1.05rem;
}

.source-card__url {
  font-size: 0.85rem;
  color: rgba(247, 245, 251, 0.6);
}

.source-card__preview {
  flex: 1;
  color: rgba(247, 245, 251, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.source-card__link {
  text-decoration: none;
  font-weight: 600;
  color: #e6ddff;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.source-card__link:hover {
  text-decoration: underline;
}

.fade-stagger {
  animation: riseSoft 0.9s ease forwards;
  animation-delay: 0.1s;
}

@keyframes riseSoft {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardFade {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
