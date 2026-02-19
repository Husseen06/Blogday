<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PostComments from '@/components/PostComments.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Posts',
  },
  subtitle: {
    type: String,
    default: '',
  },
  emptyMessage: {
    type: String,
    default: 'No posts yet. Add your first post to get started.',
  },
  showOtherPostsLink: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-post'])
const currentUser = ref({ firstName: 'Guest' })
const router = useRouter()

onMounted(() => {
  const session = localStorage.getItem('blogday.session')
  if (session) {
    try {
      currentUser.value = JSON.parse(session)
    } catch (e) {}
  }
})

const normalizedPosts = computed(() =>
  props.posts
    .map((post, index) => {
      const image =
        post.image ||
        (post.fileInput && post.fileInput instanceof File
          ? URL.createObjectURL(post.fileInput)
          : null)

      return {
        id: post.id || index,
        postTitle: post.postTitle || post.title || 'Untitled post',
        postDate: post.postDate || post.date || '',
        postAuthor: post.postAuthor || post.author || 'Unknown',
        category: post.category || 'General',
        description: post.description || '',
        content: post.content || '',
        image,
        comments: post.comments || [],
      }
    })
    .sort((a, b) => new Date(b.postDate || 0) - new Date(a.postDate || 0)),
)

const totalPosts = computed(() => normalizedPosts.value.length)

const formattedDate = (value) => {
  if (!value) return 'No date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}

function onAddComment(post, newComment) {
  emit('update-post', { postId: post.id, comment: newComment })
}

function goToPost(id) {
  router.push({ name: 'post-detail', params: { id } })
}
</script>

<template>
  <section class="py-4">
    <div class="mb-8 rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Overview</p>
      <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ title }}</h2>
      <p v-if="subtitle" class="mt-2 text-sm text-slate-600">{{ subtitle }}</p>
      <p class="mt-2 text-sm font-medium text-slate-500">{{ totalPosts }} posts</p>
      <RouterLink
        v-if="showOtherPostsLink"
        to="/other-posts"
        class="mt-3 inline-block text-sm font-semibold text-cyan-700 underline-offset-2 hover:underline"
      >
        Explore other posts
      </RouterLink>
    </div>

    <div
      v-if="isLoading"
      class="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-500"
    >
      Loading posts...
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div
      v-else-if="totalPosts === 0"
      class="rounded-xl border border-cyan-100 bg-white px-4 py-10 text-center text-slate-500"
    >
      {{ emptyMessage }}
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="post in normalizedPosts"
        :key="post.id"
        class="group overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
      >
        <div @click="goToPost(post.id)" class="cursor-pointer">
          <img
            v-if="post.image"
            :src="post.image"
            alt="Post image"
            class="h-56 w-full object-cover"
          />
          <div v-else class="flex h-56 w-full items-center justify-center bg-cyan-50 text-cyan-400">
            <span class="text-sm font-medium">No image</span>
          </div>
        </div>

        <div class="p-5">
          <div class="mb-2 flex items-center justify-between gap-3">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {{ formattedDate(post.postDate) }}
            </p>
            <span class="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800">
              {{ post.category }}
            </span>
          </div>
          <h3
            class="mb-2 cursor-pointer text-xl font-semibold text-slate-900 transition hover:text-cyan-700"
            @click="goToPost(post.id)"
          >
            {{ post.postTitle }}
          </h3>
          <p class="mb-4 line-clamp-2 text-sm text-slate-600">{{ post.description }}</p>
          <p class="line-clamp-3 text-sm text-slate-700">{{ post.content }}</p>
          <p class="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
            By {{ post.postAuthor }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
