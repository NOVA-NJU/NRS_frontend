<template>
  <div class="chat-input">
    <div class="chat-input__box">
      <textarea
        ref="textareaRef"
        v-model="localValue"
        class="chat-input__textarea"
        :placeholder="placeholder"
        :maxlength="maxLength"
        rows="2"
        @input="autoResize"
        @keydown="handleKeydown"
      ></textarea>
      <button class="chat-input__submit" :disabled="disabled" @click="handleSubmit">
        <span v-if="loading" class="loader"></span>
        <span v-else>发送</span>
      </button>
    </div>
    <div class="chat-input__hint">
      ⏎ Enter 发送 · Ctrl + Enter 换行 · 最多 {{ maxLength }} 字
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const MAX_TEXTAREA_HEIGHT = 220;

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请描述你想了解的校内通知、新闻或政策...'
  },
  maxLength: {
    type: Number,
    default: 500
  }
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [];
}>();

const localValue = ref(props.modelValue);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const disabled = computed(() => props.loading || !localValue.value.trim());

const handleSubmit = () => {
  if (!disabled.value) {
    emit('submit');
  }
};

const insertNewline = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  const { selectionStart = 0, selectionEnd = 0 } = textarea;
  const value = localValue.value;
  localValue.value = `${value.slice(0, selectionStart)}\n${value.slice(selectionEnd)}`;
  nextTick(() => {
    const cursor = selectionStart + 1;
    textarea.selectionStart = textarea.selectionEnd = cursor;
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    insertNewline();
    return;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSubmit();
  }
};

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
};

onMounted(() => {
  nextTick(autoResize);
});

watch(
  () => props.modelValue,
  (value: string) => {
    if (value !== localValue.value) {
      localValue.value = value;
    }
  }
);

watch(localValue, (value: string) => {
  emit('update:modelValue', value);
  nextTick(autoResize);
});
</script>

<style scoped>
.chat-input {
  width: min(960px, calc(100% - 2rem));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-input__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.chat-input__header span {
  font-size: 0.95rem;
  color: rgba(247, 245, 251, 0.8);
  font-weight: 400;
}

.chat-input__box {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 1.25rem;
  padding-bottom: 4.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
}

.chat-input__textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--nju-white);
  resize: none;
  font-size: 1.1rem;
  line-height: 1.7;
  font-family: inherit;
  padding-right: 7rem;
  min-height: 72px;
  max-height: 220px;
  padding-bottom: 0.5rem;
  overflow-y: auto;
}

.chat-input__textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.chat-input__submit {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(120deg, var(--nju-purple), #b580ff);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 96px;
  box-shadow: 0 10px 25px rgba(109, 44, 145, 0.4);
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.chat-input__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.chat-input__submit:not(:disabled):hover {
  transform: translateY(-1px) scale(1.01);
}

.chat-input__hint {
  text-align: right;
  font-size: 0.85rem;
  color: rgba(247, 245, 251, 0.65);
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .chat-input__textarea {
    padding-right: 0;
  }

  .chat-input__submit {
    position: static;
    width: 100%;
    margin-top: 0.75rem;
  }
}
</style>
