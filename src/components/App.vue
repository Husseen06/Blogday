<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const userFirstName = ref('')

const SESSION_STORAGE_KEY = 'blogday.session'

function checkLoginStatus() {
  const session = localStorage.getItem(SESSION_STORAGE_KEY)
  isLoggedIn.value = !!session
  if (session) {
    try {
      const sessionData = JSON.parse(session)
      userFirstName.value = sessionData.firstName || ''
    } catch (e) {
      userFirstName.value = ''
    }
  } else {
    userFirstName.value = ''
  }
}

function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  checkLoginStatus()
  router.push('/login')
}

// Initial check
checkLoginStatus()

// Watch for route changes to update login status, ensuring the navbar is always current.
watch(
  () => route.path,
  () => {
    checkLoginStatus()
  },
)
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between p-4">
      <RouterLink to="/" class="text-xl font-bold text-cyan-700">Blogday</RouterLink>
      <nav class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <RouterLink to="/" class="text-slate-600 hover:text-cyan-700">Home</RouterLink>
          <RouterLink to="/other-posts" class="text-slate-600 hover:text-cyan-700"
            >Other Posts</RouterLink
          >
          <RouterLink to="/about" class="text-slate-600 hover:text-cyan-700">About</RouterLink>
          <span class="text-slate-500">|</span>
          <span class="text-slate-700">Welcome, {{ userFirstName }}</span>
          <button
            @click="logout"
            class="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="text-slate-600 hover:text-cyan-700">Login</RouterLink>
          <RouterLink
            to="/register"
            class="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >Register</RouterLink
          >
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>
