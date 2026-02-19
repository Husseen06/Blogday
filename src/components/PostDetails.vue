<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostComments from '@/components/PostComments.vue'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const currentUser = ref({ firstName: 'Guest' })
const STORAGE_KEY = 'blogday.posts'
const isEditing = ref(false)
const editForm = ref({
  title: '',
  description: '',
  content: '',
  category: '',
})

onMounted(() => {
  const session = localStorage.getItem('blogday.session')
  if (session) {
    try {
      currentUser.value = JSON.parse(session)
    } catch (e) {}
  }
  loadPost()
})

function loadPost() {
  const postId = route.params.id
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const posts = raw ? JSON.parse(raw) : []
    post.value = posts.find((p) => String(p.id) === String(postId))
  } catch (err) {
    console.error('Failed to load post', err)
  }
}

function handleAddComment(newComment) {
  if (!post.value) return

  const updatedComments = [newComment, ...(post.value.comments || [])]
  post.value.comments = updatedComments
  saveCommentsToStorage()
}

function handleDeleteComment(comment) {
  if (!post.value) return
  if (!confirm('Delete this comment?')) return

  const updatedComments = (post.value.comments || []).filter((c) => c !== comment)
  post.value.comments = updatedComments
  saveCommentsToStorage()
}

function handleUpdateComment(updatedComment) {
  if (!post.value) return

  const comments = post.value.comments || []
  const index = comments.findIndex(
    (c) => (c.id || c.ID) === (updatedComment.id || updatedComment.ID),
  )

  if (index !== -1) {
    comments[index] = updatedComment
    post.value.comments = [...comments]
    saveCommentsToStorage()
  }
}

function saveCommentsToStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const posts = raw ? JSON.parse(raw) : []
    const index = posts.findIndex((p) => String(p.id) === String(post.value.id))
    if (index !== -1) {
      posts[index].comments = post.value.comments
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    }
  } catch (err) {
    console.error('Failed to save comments', err)
  }
}

function enableEdit() {
  editForm.value = {
    title: postTitle.value,
    description: post.value.description || '',
    content: postContent.value,
    category: postCategory.value,
  }
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function savePost() {
  if (!post.value) return

  post.value.postTitle = editForm.value.title
  post.value.title = editForm.value.title
  post.value.image = editForm.value.image
  post.value.postAuthor = postAuthor.value
  post.value.description = editForm.value.description
  post.value.content = editForm.value.content
  post.value.category = editForm.value.category

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const posts = raw ? JSON.parse(raw) : []
    const index = posts.findIndex((p) => String(p.id) === String(post.value.id))
    if (index !== -1) {
      posts[index] = { ...posts[index], ...post.value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    }
  } catch (err) {
    console.error('Failed to save post', err)
  }
  isEditing.value = false
}

function deletePost() {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let posts = raw ? JSON.parse(raw) : []
    posts = posts.filter((p) => String(p.id) !== String(post.value.id))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    router.push('/')
  } catch (err) {
    console.error('Failed to delete post', err)
  }
}

const formattedDate = computed(() => {
  if (!post.value) return ''
  const dateVal = post.value.postDate || post.value.date || post.value.createdAt
  if (!dateVal) return 'No date'
  const parsed = new Date(dateVal)
  if (Number.isNaN(parsed.getTime())) return dateVal
  return parsed.toLocaleDateString()
})

const postImage = computed(() => {
  if (!post.value) return null
  return post.value.image
})

const postTitle = computed(() => post.value?.postTitle || post.value?.title || 'Untitled')
const postAuthor = computed(() => post.value?.postAuthor || post.value?.author || 'Unknown')
const postCategory = computed(() => post.value?.category || 'General')
const postContent = computed(() => post.value?.content || '')
</script>

<template>
  <section class="min-h-screen py-10">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <button
        @click="router.back()"
        class="mb-6 inline-flex items-center text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
      >
        &larr; Back
      </button>

      <div
        v-if="post"
        class="overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm"
      >
        <img
          v-if="postImage"
          :src="postImage"
          alt="Post image"
          class="h-64 w-full object-cover sm:h-96"
        />
        <div
          v-else
          class="flex h-64 w-full items-center justify-center bg-cyan-50 text-cyan-400 sm:h-96"
        >
          <span class="text-lg font-medium">No image available</span>
        </div>

        <div class="p-6 sm:p-10">
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <span
                class="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800"
              >
                {{ isEditing ? 'Editing' : postCategory }}
              </span>
              <span class="text-sm font-medium text-slate-500">
                {{ formattedDate }}
              </span>
            </div>

            <div v-if="currentUser.firstName === postAuthor && !isEditing" class="flex gap-3">
              <button
                @click="enableEdit"
                class="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
              >
                Edit
              </button>
              <button
                @click="deletePost"
                class="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          <div v-if="isEditing" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                v-model="editForm.title"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <input
                v-model="editForm.category"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                v-model="editForm.description"
                rows="2"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              ></textarea>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <textarea
                v-model="editForm.content"
                rows="8"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              ></textarea>
            </div>
            <div class="flex gap-3 pt-2">
              <button
                @click="savePost"
                class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Save Changes
              </button>
              <button
                @click="cancelEdit"
                class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <template v-else>
            <h1 class="mb-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {{ postTitle }}
            </h1>

            <div class="mb-8 flex items-center gap-3 border-b border-slate-100 pb-8">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-bold"
              >
                {{ postAuthor.charAt(0).toUpperCase() }}
              </div>
              <div class="text-sm">
                <p class="font-semibold text-slate-900">{{ postAuthor }}</p>
                <p class="text-slate-500">Author</p>
              </div>
            </div>

            <div class="prose prose-slate max-w-none text-slate-700">
              <p class="whitespace-pre-wrap">{{ postContent }}</p>
            </div>
          </template>

          <div class="mt-10">
            <PostComments
              :list-data="post.comments || []"
              :current-user="currentUser"
              @add-comment="handleAddComment"
              @delete-comment="handleDeleteComment"
              @update-comment="handleUpdateComment"
            />
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <p class="text-lg text-slate-500">Post not found.</p>
        <button @click="router.push('/')" class="mt-4 text-cyan-600 hover:underline">
          Go Home
        </button>
      </div>
    </div>
  </section>
</template>
