<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['add', 'cancel'])
const submitError = ref('')
const filePreview = ref(null)
const fileInputEl = ref(null)

const form = reactive({
  postID: null,
  postTitle: '',
  postDate: new Date().toISOString().slice(0, 10),
  postAuthor:
    'firstName' in JSON.parse(localStorage.getItem('blogday.session') || '{}')
      ? JSON.parse(localStorage.getItem('blogday.session')).firstName
      : 'Guest',
  category: 'General',
  description: '',
  content: '',
  action: 'Save and Publish',
  fileInput: null,
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  submitError.value = ''

  if (file) {
    form.fileInput = file

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      filePreview.value = null
    }
  } else {
    form.fileInput = null
    filePreview.value = null
  }
}

const resetForm = () => {
  form.postID = null
  form.postTitle = ''
  form.category = 'General'
  form.description = ''
  form.content = ''
  form.action = 'Save and Publish'
  form.fileInput = null
  filePreview.value = null
  if (fileInputEl.value) fileInputEl.value.value = ''
}

const addPost = () => {
  submitError.value = ''

  try {
    let imageBase64 = null
    if (form.fileInput && form.fileInput.type.startsWith('image/')) {
      imageBase64 = filePreview.value
    }
    form.postAutor = JSON.parse(localStorage.getItem('blogday.session'))?.firstName
    const newPost = {
      id: form.postID || Date.now(),
      title: form.postTitle,
      date: form.postDate,
      author: form.postAuthor,
      category: form.category,
      description: form.description,
      content: form.content,
      image: imageBase64,
      status: form.action === 'Save and Publish' ? 'published' : 'draft',
      createdAt: new Date().toISOString(),
    }

    emit('add', newPost)
    resetForm()
  } catch (err) {
    console.error('Error creating local post:', err)
    submitError.value = 'Failed to add post. Please try again.'
  }
}

const cancel = () => {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="addPost" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-6 text-2xl font-bold text-slate-900">Add New Post</h2>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Post Title</label>
      <input
        v-model="form.postTitle"
        type="text"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-500"
        required
      />
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Post Date</label>
      <input
        v-model="form.postDate"
        type="date"
        class="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
        readonly
        disabled
      />
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Post Author</label>
      <input
        v-model="form.postAuthor"
        type="text"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
        readonly
        disabled
      />
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Description</label>
      <input
        v-model="form.description"
        type="text"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
      />
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Category</label>
      <select
        v-model="form.category"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
      >
        <option>General</option>
        <option>Technology</option>
        <option>Business</option>
        <option>Lifestyle</option>
        <option>Travel</option>
        <option>Health</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Content</label>
      <textarea
        v-model="form.content"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
        rows="5"
        required
      ></textarea>
    </div>

    <div class="mb-4">
      <label class="mb-2 block text-sm font-medium text-slate-900" for="file_input"
        >Upload image</label
      >
      <input
        id="file_input"
        ref="fileInputEl"
        type="file"
        @change="handleFileUpload"
        accept="image/*"
        class="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
      />

      <div v-if="filePreview" class="mt-2">
        <p class="mb-1 text-sm text-slate-600">Preview:</p>
        <img
          :src="filePreview"
          alt="Preview"
          class="max-h-40 rounded-lg border border-slate-200 shadow-sm"
        />
      </div>
    </div>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-slate-900">Visibility</label>
      <select
        v-model="form.action"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
      >
        <option>Save and Publish</option>
        <option>Save Draft</option>
      </select>
    </div>

    <p
      v-if="submitError"
      class="mb-4 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
    >
      {{ submitError }}
    </p>

    <div class="flex items-center justify-end gap-3">
      <button
        type="button"
        @click="cancel"
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn-create rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-900 cursor-pointer"
      >
        Add Post
      </button>
    </div>
  </form>
</template>



