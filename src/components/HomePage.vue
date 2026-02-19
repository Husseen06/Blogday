<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PostList from '@/components/PostList.vue'
import PostForm from '@/components/PostForm.vue'

const showAddPost = ref(false)
const posts = ref([])
const STORAGE_KEY = 'blogday.posts'

const sortedPosts = computed(() =>
  [...posts.value].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date || 0).getTime()
    const bTime = new Date(b.createdAt || b.date || 0).getTime()
    return bTime - aTime
  }),
)

const featuredPosts = computed(() => sortedPosts.value.slice(0, 3))
const publishedCount = computed(
  () => posts.value.filter((post) => (post.status || 'published') === 'published').length,
)
const draftCount = computed(
  () => posts.value.filter((post) => (post.status || 'published') === 'draft').length,
)
const topCategories = computed(() => {
  const counts = posts.value.reduce((acc, post) => {
    const category = post.category || 'General'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
})

function handleAddPost(createdPost) {
  posts.value = [createdPost, ...posts.value.filter((post) => post.id !== createdPost.id)]
  showAddPost.value = false
}

function handleUpdatePost({ postId, comment }) {
  const postIndex = posts.value.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    const post = posts.value[postIndex]
    const updatedPost = {
      ...post,
      comments: [comment, ...(post.comments || [])],
    }
    posts.value[postIndex] = updatedPost
  }
}

function closeAddPost() {
  showAddPost.value = false
}

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    posts.value = raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load local posts', err)
    posts.value = []
  }
}

watch(
  posts,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

onMounted(loadPosts)
</script>

<template>
  <section class="min-h-screen py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header
        class="mb-8 grid gap-6 rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 via-white to-sky-50/70 p-6 shadow-sm md:grid-cols-[1.2fr_1fr]"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Welcome to Blogday
          </p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Share ideas. Build your story. Grow your audience.
          </h1>
          <p class="mt-3 max-w-xl text-sm text-slate-600">
            This is your publishing home. Write posts, organize by category, and keep your best
            three featured on the front page.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="[name, count] in topCategories"
              :key="name"
              class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              {{ name }} ({{ count }})
            </span>
            <span
              v-if="topCategories.length === 0"
              class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              Start by creating your first category
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-cyan-100 bg-white/80 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">Total posts</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ posts.length }}</p>
          </div>
          <div class="rounded-2xl border border-cyan-100 bg-white/80 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">Featured</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ featuredPosts.length }}</p>
          </div>
          <div class="rounded-2xl border border-cyan-100 bg-white/80 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">Published</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ publishedCount }}</p>
          </div>
          <div class="rounded-2xl border border-cyan-100 bg-white/80 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">Drafts</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ draftCount }}</p>
          </div>
        </div>
      </header>

      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Creator Dashboard</h2>
          <p class="mt-1 text-sm text-slate-600">
            Manage your featured content and publish faster.
          </p>
        </div>
        <button
          @click="showAddPost = !showAddPost"
          class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-cyan-800 cursor-pointer"
        >
          {{ showAddPost ? 'Close Form' : 'Add Post' }}
        </button>
      </div>

      <PostForm v-if="showAddPost" @add="handleAddPost" @cancel="closeAddPost" class="mb-8" />

      <PostList
        :posts="featuredPosts"
        title="Featured Posts"
        subtitle="Top 3 most recent posts are featured here."
        :show-other-posts-link="true"
        empty-message="No featured posts yet. Add posts and the newest 3 will appear here."
        @update-post="handleUpdatePost"
      />

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Write with categories</h3>
          <p class="mt-2 text-sm text-slate-600">
            Organize content into clear topics so readers can discover posts quickly.
          </p>
        </div>
        <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Keep top posts featured</h3>
          <p class="mt-2 text-sm text-slate-600">
            Your latest 3 posts are highlighted on the homepage automatically.
          </p>
        </div>
        <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Explore everything else</h3>
          <p class="mt-2 text-sm text-slate-600">
            All remaining posts live in Other Posts with category filtering.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
