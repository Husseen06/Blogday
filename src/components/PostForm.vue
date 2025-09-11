<script setup>
import { reactive, ref } from 'vue'

const post = reactive({
  postTitle: '',
  postDate: new Date().toISOString().slice(0, 10),
  postAuthor: '',
  description: '',
  content: '',
  action: 'Save and Publish',
  fileInput: null,
})

const filePreview = ref(null)

const emit = defineEmits(['add'])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    post.fileInput = file

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      filePreview.value = null
    }
  }
}

const addPost = () => {
  emit('add', { ...post })

  post.postTitle = ''
  post.postAuthor = ''
  post.description = ''
  post.content = ''
  post.fileInput = null
  filePreview.value = null

  const input = document.getElementById('file_input')
  if (input) input.value = ''
}
</script>

<template>
  <form @submit.prevent="addPost" class="max-w-xl mx-auto p-4 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Add New Post</h2>

    <div class="mb-4">
      <label class="block mb-1">Post Title</label>
      <input v-model="post.postTitle" type="text" class="border p-2 w-full" required />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Post Date</label>
      <input
        v-model="post.postDate"
        type="date"
        class="border p-2 w-full bg-gray-100"
        readonly
        disabled
      />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Post Author</label>
      <input v-model="post.postAuthor" type="text" class="border p-2 w-full" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Description</label>
      <input v-model="post.description" type="text" class="border p-2 w-full" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Content</label>
      <textarea v-model="post.content" class="border p-2 w-full" rows="5" required></textarea>
    </div>

    <div class="mb-4">
      <label class="block mb-2 text-sm font-medium" for="file_input">Upload file</label>
      <input
        id="file_input"
        type="file"
        @change="handleFileUpload"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        required
      />

      <div v-if="filePreview" class="mt-2">
        <p class="text-gray-600 text-sm mb-1">Preview:</p>
        <img :src="filePreview" alt="Preview" class="max-h-40 rounded shadow" />
      </div>
    </div>

    <div class="mb-4">
      <select v-model="post.action" class="border p-2 w-full">
        <option>Save and Publish</option>
        <option>Save Draft</option>
      </select>
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Add Post
    </button>
  </form>
</template>
