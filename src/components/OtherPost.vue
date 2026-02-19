<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PostList from '@/components/PostList.vue'

const STORAGE_KEY = 'blogday.posts'
const posts = ref([])
const selectedCategory = ref('All')

const sortedPosts = computed(() =>
  [...posts.value].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date || 0).getTime()
    const bTime = new Date(b.createdAt || b.date || 0).getTime()
    return bTime - aTime
  }),
)

const categories = computed(() => [
  'All',
  ...new Set(sortedPosts.value.map((post) => post.category || 'General')),
])

const nonFeaturedPosts = computed(() => sortedPosts.value.slice(3))

const filteredPosts = computed(() =>
  nonFeaturedPosts.value.filter((post) => {
    if (selectedCategory.value === 'All') return true
    return (post.category || 'General') === selectedCategory.value
  }),
)

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    posts.value = raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load local posts', err)
    posts.value = []
  }
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
  <section class="py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header
        class="mb-6 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 to-white p-6 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Blogday</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Other Posts
        </h1>
        <p class="mt-3 text-sm text-slate-600">
          Posts after the top 3 featured entries are shown here.
        </p>
      </header>

      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition"
          :class="
            selectedCategory === category
              ? 'border-cyan-700 bg-cyan-700 text-white'
              : 'border-cyan-200 bg-white text-slate-600 hover:border-cyan-500 hover:text-cyan-800'
          "
        >
          {{ category }}
        </button>
      </div>

      <PostList
        :posts="filteredPosts"
        title="All Other Posts"
        subtitle="These are posts ranked below the featured top 3."
        :show-other-posts-link="false"
        empty-message="No additional posts yet. Create more than 3 posts to populate this section."
        @update-post="handleUpdatePost"
      />
    </div>
  </section>
</template>
