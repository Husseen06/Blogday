<script setup>
import { computed } from 'vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
})

const postsWithImages = computed(() =>
  props.posts.map((post) => {
    if (post.fileInput && post.fileInput instanceof File) {
      return { ...post, image: URL.createObjectURL(post.fileInput) }
    }
    return { ...post, image: post.image || null }
  }),
)
</script>

<template>
  <section class="py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="font-manrope text-4xl font-bold text-gray-900 text-center mb-16">
        {{ posts.length }} Unique Posts Available
      </h2>

      <div class="flex flex-row min-h-screen justify-center">
        <div class="group border border-gray-300 rounded-2xl flex flex-col h-full mb-16">
          <div class="flex items-center">
            <img
              src="@/assets/grappigestockimg.jpg"
              alt="Welcome to Blogday"
              class="rounded-t-2xl w-500 object-cover h-95"
            />
          </div>
          <div
            class="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50 flex-1 flex flex-col"
          >
            <span class="text-indigo-600 font-medium mb-3 block">2024-01-01</span>
            <h4 class="text-xl text-gray-900 font-medium leading-8 mb-5">Welcome to Blogday!</h4>
            <p class="text-gray-500 leading-6 mb-10">
              This is your first post. Feel free to add more using the "Add Post" button above!
            </p>
            <span class="text-slate-700 mt-auto"
              >Start sharing your thoughts and updates with the world.</span
            >
          </div>
        </div>
      </div>

      <div v-if="posts.length === 0" class="text-center text-gray-400 mt-10">
        No posts yet. Click "Add Post" to create one!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(post, idx) in postsWithImages"
          :key="idx"
          class="group border border-gray-300 rounded-2xl flex flex-col h-full"
        >
          <div class="flex items-center">
            <img
              v-if="post.image"
              :src="post.image"
              alt="Post image"
              class="rounded-t-2xl w-full object-cover h-64"
            />
            <div
              v-else
              class="bg-gray-200 rounded-t-2xl w-full h-64 flex items-center justify-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-16 h-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z"
                />
              </svg>
            </div>
          </div>

          <div
            class="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50 flex-1 flex flex-col"
          >
            <span class="text-indigo-600 font-medium mb-3 block">{{ post.postDate }}</span>
            <h4 class="text-xl text-gray-900 font-medium leading-8 mb-5">{{ post.postTitle }}</h4>
            <p class="text-gray-500 leading-6 mb-10">{{ post.description }}</p>
            <span class="text-slate-700 mt-auto">{{ post.content }}</span>
            <div class="mt-4 text-sm text-gray-400">By {{ post.postAuthor || 'Unknown' }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
