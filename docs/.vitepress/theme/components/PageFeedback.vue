<script setup lang="ts">
import { ref, onMounted } from 'vue'

const feedback = ref<'yes' | 'no' | null>(null)
const comment = ref('')
const submitted = ref(false)
const feedbackKey = ref('')

onMounted(() => {
  // Generate a unique key for this page
  feedbackKey.value = `feedback-${window.location.pathname}`
  const saved = localStorage.getItem(feedbackKey.value)
  if (saved) {
    feedback.value = saved as 'yes' | 'no'
  }
})

function submitFeedback(type: 'yes' | 'no') {
  feedback.value = type
  localStorage.setItem(feedbackKey.value, type)
  submitted.value = true

  // In production, you would send this to your analytics
  console.log('Feedback:', {
    page: window.location.pathname,
    helpful: type,
    comment: comment.value
  })

  // Reset after 3 seconds
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>

<template>
  <div class="page-feedback">
    <div class="feedback-content">
      <p class="feedback-question">
        {{ $lang === 'ar' ? 'هل كان هذا المحتوى مفيداً؟' : 'Was this page helpful?' }}
      </p>

      <div v-if="!feedback" class="feedback-buttons">
        <button
          class="feedback-btn yes"
          @click="submitFeedback('yes')"
          :aria-label="$lang === 'ar' ? 'نعم، كان مفيداً' : 'Yes, helpful'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          <span>{{ $lang === 'ar' ? 'نعم' : 'Yes' }}</span>
        </button>
        <button
          class="feedback-btn no"
          @click="submitFeedback('no')"
          :aria-label="$lang === 'ar' ? 'لا، لم يكن مفيداً' : 'No, not helpful'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>
          <span>{{ $lang === 'ar' ? 'لا' : 'No' }}</span>
        </button>
      </div>

      <div v-else class="feedback-thanks">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ $lang === 'ar' ? 'شكراً لك على ملاحظاتك!' : 'Thanks for your feedback!' }}</span>
      </div>

      <div v-if="feedback === 'no' && !submitted" class="feedback-comment">
        <textarea
          v-model="comment"
          :placeholder="$lang === 'ar' ? 'أخبرنا كيف يمكننا التحسين (اختياري)' : 'Tell us how to improve (optional)'"
          rows="2"
        ></textarea>
      </div>

      <a
        v-if="feedback === 'no'"
        :href="`https://github.com/grovlix/salla-webhook-reference/issues/new?title=[Docs] ${encodeURIComponent(document.title)}`"
        class="feedback-report"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $lang === 'ar' ? 'الإبلاغ عن مشكلة' : 'Report an issue' }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.page-feedback {
  margin-top: 48px;
  padding: 24px;
  border-top: 1px solid var(--vp-c-border);
  text-align: center;
}

.feedback-content {
  max-width: 400px;
  margin: 0 auto;
}

.feedback-question {
  color: var(--vp-c-text-1);
  font-weight: 600;
  margin-bottom: 16px;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.feedback-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.feedback-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.feedback-btn.yes:hover {
  border-color: #3eaf7c;
  color: #3eaf7c;
}

.feedback-btn.no:hover {
  border-color: #f97575;
  color: #f97575;
}

.feedback-thanks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #3eaf7c;
  font-weight: 500;
}

.feedback-comment {
  margin-top: 16px;
}

.feedback-comment textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: vertical;
  font-family: inherit;
}

.feedback-comment textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.feedback-report {
  display: inline-block;
  margin-top: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-decoration: none;
}

.feedback-report:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

[dir="rtl"] .feedback-btn svg {
  margin-right: 0;
  margin-left: 0;
}
</style>
