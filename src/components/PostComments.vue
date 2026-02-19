<script setup>
import { ref } from 'vue'

const props = defineProps({
  listData: {
    type: Array,
    default: () => [],
  },
  currentUser: {
    type: Object,
    default: () => ({ firstName: 'Guest' }),
  },
})

const emit = defineEmits(['add-comment', 'delete-comment', 'update-comment'])

const text = ref('')
const editingCommentId = ref(null)
const editText = ref('')

const submitComment = () => {
  const content = text.value.trim()
  if (!content) return

  const newComment = {
    id: Date.now(),
    content: content,
    user_name: props.currentUser?.firstName || 'Guest',
    created_at: new Date().toISOString(),
  }

  emit('add-comment', newComment)
  text.value = ''
}

const startEditing = (comment) => {
  editingCommentId.value = comment.id || comment.ID
  editText.value = comment.content
}

const cancelEditing = () => {
  editingCommentId.value = null
  editText.value = ''
}

const saveEdit = (comment) => {
  if (!editText.value.trim()) return
  const updatedComment = { ...comment, content: editText.value }
  emit('update-comment', updatedComment)
  editingCommentId.value = null
  editText.value = ''
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitComment()
  }
}
</script>

<template>
  <div class="mt-4 border-t border-slate-100 pt-4">
    <h4 class="mb-3 text-sm font-bold text-slate-900">Comments</h4>

    <div class="mb-4 space-y-3">
      <div v-if="listData.length > 0">
        <div
          v-for="comment in listData"
          :key="comment.id || comment.ID"
          class="mb-2 rounded-lg bg-slate-50 p-3"
        >
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-900">
              {{ comment.user_name || 'Unknown User' }}
            </span>
            <span class="text-xs text-slate-500">
              {{ comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '' }}
            </span>
          </div>

          <div v-if="editingCommentId === (comment.id || comment.ID)">
            <textarea
              v-model="editText"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              rows="2"
            ></textarea>
            <div class="mt-2 flex gap-2">
              <button
                @click="saveEdit(comment)"
                class="text-xs font-medium text-cyan-600 hover:underline"
              >
                Save
              </button>
              <button
                @click="cancelEditing"
                class="text-xs font-medium text-slate-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
          <div v-else>
            <p class="text-sm text-slate-700">{{ comment.content }}</p>
            <div v-if="currentUser.firstName === comment.user_name" class="mt-2 flex gap-3">
              <button
                @click="$emit('delete-comment', comment)"
                class="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Delete
              </button>
              <button
                @click="startEditing(comment)"
                class="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm italic text-slate-500">No comments yet. Be the first!</p>
    </div>

    <div class="flex gap-2">
      <textarea
        v-model="text"
        @keypress="handleKeyPress"
        placeholder="Write a comment..."
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        rows="1"
      ></textarea>

      <button
        @click="submitComment"
        class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 cursor-pointer"
      >
        Post
      </button>
      <button>
        <button
          @click="text = ''"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 cursor-pointer"
        >
          Clear
        </button>
      </button>
    </div>
  </div>
</template>
